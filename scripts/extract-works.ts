/**
 * 一次性脚本：把 src/data/poets.ts 中每位诗人的 works_content 字段抽取到
 * src/data/works.ts，poets.ts 中删除该字段。后续 PoetDetailModal 通过
 * dynamic import 按需加载 works.ts。
 *
 * 运行方式：tsx scripts/extract-works.ts
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { poets } from '../src/data/poets';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const works: Record<string, string[]> = {};
const slimPoets = poets.map((p) => {
  if (p.works_content && p.works_content.length > 0) {
    works[p.name] = p.works_content;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { works_content: _omit, ...rest } = p;
  return rest;
});

const worksFile = `// 自动生成自 scripts/extract-works.ts
// 这是一个独立的 chunk，仅在 PoetDetailModal 打开时按需加载，
// 不进入首屏 bundle。

export const WORKS_CONTENT: Record<string, string[]> = ${JSON.stringify(
  works,
  null,
  2,
)};
`;

const poetsFile = `export interface Poet {
  name: string;
  birth_year: number;
  death_year: number;
  era: string;
  lane: number;
  weight: number;
  tags: string[];
  works_short: string;
  short_desc: string;
  unknown_dates?: boolean;
}

export const poets: Poet[] = ${JSON.stringify(slimPoets, null, 2)};
`;

writeFileSync(path.join(ROOT, 'src/data/works.ts'), worksFile, 'utf8');
writeFileSync(path.join(ROOT, 'src/data/poets.ts'), poetsFile, 'utf8');

console.log(
  `[extract-works] OK: 抽取 ${Object.keys(works).length} 首诗，poets.ts 已瘦身`,
);
