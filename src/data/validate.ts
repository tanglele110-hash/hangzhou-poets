import { poets, type Poet } from './poets';
import { KNOWN_RELATIONSHIPS } from './relationships';

const MIN_OVERLAP_YEARS = 5;
// 血缘 / 宗族类关系本就允许短重叠（祖孙、父子、宗族晚辈生于长辈晚年），
// 不参与"重叠 < 5 年"告警。
const KINSHIP_LABELS = new Set(['祖孙', '父子', '兄弟', '宗族兄弟', '夫妇']);

export interface ValidationIssue {
  level: 'error' | 'warn';
  message: string;
}

function lifespan(poet: Poet): [number, number] {
  return [poet.birth_year, poet.death_year];
}

function overlapYears(a: Poet, b: Poet): number {
  const [as, ae] = lifespan(a);
  const [bs, be] = lifespan(b);
  return Math.min(ae, be) - Math.max(as, bs);
}

export function validateData(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const byName = new Map<string, Poet>();

  for (const p of poets) {
    if (byName.has(p.name)) {
      issues.push({ level: 'error', message: `重复诗人: "${p.name}"` });
    }
    byName.set(p.name, p);

    if (!p.unknown_dates && p.birth_year >= p.death_year) {
      issues.push({
        level: 'error',
        message: `"${p.name}" 生卒年颠倒: ${p.birth_year}-${p.death_year}`,
      });
    }
    if (p.weight < 1 || p.weight > 3) {
      issues.push({
        level: 'error',
        message: `"${p.name}" weight 越界: ${p.weight} (应为 1-3)`,
      });
    }
    if (!p.tags || p.tags.length === 0) {
      issues.push({ level: 'warn', message: `"${p.name}" 未配置 tags` });
    }
    if (!p.short_desc) {
      issues.push({ level: 'warn', message: `"${p.name}" 缺少 short_desc` });
    }
    if (!p.works_short) {
      issues.push({ level: 'warn', message: `"${p.name}" 缺少 works_short` });
    }
  }

  const seenPairs = new Set<string>();
  for (const rel of KNOWN_RELATIONSHIPS) {
    const src = byName.get(rel.source);
    const tgt = byName.get(rel.target);
    if (!src) {
      issues.push({
        level: 'error',
        message: `关系 "${rel.source} → ${rel.target}" 的 source "${rel.source}" 不在 poets 数据中`,
      });
    }
    if (!tgt) {
      issues.push({
        level: 'error',
        message: `关系 "${rel.source} → ${rel.target}" 的 target "${rel.target}" 不在 poets 数据中`,
      });
    }
    if (rel.source === rel.target) {
      issues.push({
        level: 'error',
        message: `关系 "${rel.source}" 指向自己`,
      });
    }
    if (!rel.label) {
      issues.push({
        level: 'warn',
        message: `关系 "${rel.source} → ${rel.target}" 缺少 label`,
      });
    }

    const pairKey = [rel.source, rel.target].sort().join('↔');
    if (seenPairs.has(pairKey)) {
      issues.push({
        level: 'warn',
        message: `重复关系对: ${pairKey}`,
      });
    }
    seenPairs.add(pairKey);

    if (
      src &&
      tgt &&
      !src.unknown_dates &&
      !tgt.unknown_dates &&
      !KINSHIP_LABELS.has(rel.label)
    ) {
      const overlap = overlapYears(src, tgt);
      if (overlap < MIN_OVERLAP_YEARS) {
        issues.push({
          level: 'warn',
          message: `"${rel.source}(${src.birth_year}-${src.death_year}) ↔ ${rel.target}(${tgt.birth_year}-${tgt.death_year})" 生平重叠仅 ${overlap} 年，"${rel.label}" 关系存疑`,
        });
      }
    }
  }

  return issues;
}

export function assertDataValid(): void {
  const issues = validateData();
  const errors = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warn');

  if (warns.length > 0) {
    console.warn(
      `[data-validate] ${warns.length} 条警告:\n` +
        warns.map((w) => `  - ${w.message}`).join('\n'),
    );
  }
  if (errors.length > 0) {
    const msg =
      `[data-validate] 数据校验失败，共 ${errors.length} 条错误:\n` +
      errors.map((e) => `  - ${e.message}`).join('\n');
    throw new Error(msg);
  }
}
