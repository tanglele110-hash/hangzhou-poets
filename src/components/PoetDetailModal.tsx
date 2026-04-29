import React, { useEffect, useState } from 'react';
import { Network, X } from 'lucide-react';
import type { Poet } from '../data';
import { KNOWN_RELATIONSHIPS } from '../data';
import type { PositionedPoet } from '../types';
import { getPoetMeta } from '../utils';

interface PoetDetailModalProps {
  poet: PositionedPoet;
  onClose: () => void;
  onShowGraph?: (poet: Poet) => void;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; lines: string[] | null }
  | { status: 'error'; message: string };

/** 朝代 → label-pill 颜色类 */
function pillClassForEra(era: string): string {
  if (['初唐', '盛唐', '中唐', '晚唐'].includes(era)) return 'label-pill-tang';
  if (era === '北宋') return 'label-pill-nsong';
  if (era === '南宋' || era === '宋') return 'label-pill-ssong';
  return 'label-pill-ink';
}

export const PoetDetailModal: React.FC<PoetDetailModalProps> = ({
  poet,
  onClose,
  onShowGraph,
}) => {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const meta = getPoetMeta(poet);

  const eraDisplay = poet.era === '宋' ? (poet.birth_year < 1127 ? '北宋' : '南宋') : poet.era;
  const yearLabel = poet.unknown_dates
    ? '生卒年不详'
    : `${poet.birth_year} — ${poet.death_year}`;

  const hasConnections = KNOWN_RELATIONSHIPS.some(
    (rel) => rel.source === poet.name || rel.target === poet.name,
  );

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    import('../data/works')
      .then((mod) => {
        if (cancelled) return;
        const lines = mod.WORKS_CONTENT[poet.name] ?? null;
        setState({ status: 'ready', lines });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [poet.name]);

  /** 全文展示：横排诗体，每两句一行做视觉断句 */
  const renderWorks = () => {
    if (state.status === 'loading') {
      return <div className="text-[#a89e89] text-sm tracking-widest font-mono-design">LOADING…</div>;
    }
    if (state.status === 'error') {
      return (
        <div className="text-[#b83b3b] text-sm tracking-wider">
          加载失败：{state.message}
        </div>
      );
    }
    if (state.status === 'ready' && !state.lines) {
      return (
        <div className="text-[#a89e89] italic text-sm sm:text-base tracking-widest">
          全文暂未收录，敬请期待。
        </div>
      );
    }
    return (
      <div className="space-y-1.5 text-[#2c2c2c] tracking-[0.12em] leading-[1.85] text-base sm:text-lg font-medium">
        {state.lines!.map((line, i) => (
          <p key={i} className="m-0">
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-3 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-[#1a1714]/55 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* 主卡：一张大纸，纸纹 + vignette */}
      <div
        className="relative pointer-events-auto bg-texture-vignette border border-[#d4c4b7] shadow-[0_30px_80px_-20px_rgba(20,15,5,0.55)]
                   w-full max-w-[920px] max-h-[92vh] sm:max-h-[88vh]
                   rounded-sm overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* 顶栏 */}
        <div className="shrink-0 flex justify-between items-center px-6 sm:px-12 pt-5 sm:pt-7 pb-2.5 sm:pb-3">
          <div className="modal-wordmark text-[12px] sm:text-[14px]">
            杭州 · 唐宋诗词名家图鉴
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="modal-index-tag hidden sm:inline">
              POET · DETAIL
            </span>
            <button
              onClick={onClose}
              className="text-[#a89e89] hover:text-[#b83b3b] transition-colors"
              aria-label="关闭"
            >
              <X size={22} />
            </button>
          </div>
        </div>
        <div className="shrink-0 mx-6 sm:mx-12 h-px bg-[#d4c4b7]" />

        {/* 主体 */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 sm:px-12 py-6 sm:py-8 relative">
          {/* 朱印 — 右上方，与 pill row 同高 */}
          <div
            className="seal-stamp absolute top-6 sm:top-8 right-6 sm:right-12 w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] text-[28px] sm:text-[36px] rounded-[2px] z-[2]"
            aria-hidden
          >
            {meta.seal}
          </div>

          {/* 第 1 行：朝代 pill + 生卒年 */}
          <div className="flex items-center gap-3 sm:gap-5 pr-[68px] sm:pr-[88px]">
            <span className={`label-pill-base ${pillClassForEra(eraDisplay)}`}>
              {eraDisplay}
            </span>
            <span className="font-mono-design text-[14px] sm:text-[18px] text-[#a89e89] tracking-[0.18em]">
              {yearLabel}
            </span>
          </div>

          {/* 在杭事迹 */}
          {meta.hangzhouRole && (
            <div className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] text-[#6b6458] tracking-[0.15em] pr-[68px] sm:pr-[88px]">
              {meta.hangzhouRole}
            </div>
          )}

          {/* 大字名 + 拼音 + accent */}
          <div className="mt-6 sm:mt-9 relative">
            <h1 className="poet-bigname text-[64px] sm:text-[120px] pr-[60px] sm:pr-[80px]">
              {poet.name}
            </h1>
            <div className="poet-pinyin mt-2 sm:mt-3 text-[12px] sm:text-[14px]">
              {meta.pinyin.join(' · ')}
            </div>

            {/* accent 朱字（竖排，右上） */}
            {meta.accent && (
              <div className="poet-accent-vertical absolute right-0 top-1 sm:top-2 text-[28px] sm:text-[44px] hidden sm:block">
                {meta.accent}
              </div>
            )}
          </div>

          {/* divider */}
          <div className="mt-6 sm:mt-10 mb-5 sm:mb-7 h-px bg-[#d4c4b7]/80" />

          {/* 引语 */}
          {meta.quote && (
            <div className="mb-6 sm:mb-9">
              <div className="poet-quote-text text-[18px] sm:text-[26px]">
                {meta.quote.lines.map((l, i) => (
                  <p key={i} className="m-0">
                    {l}
                  </p>
                ))}
              </div>
              <div className="poet-quote-src mt-2.5 ml-[22px] text-[12px] sm:text-[14px]">
                —— 《{meta.quote.source}》
              </div>
            </div>
          )}

          {/* tags */}
          {poet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-7 sm:mb-9">
              {poet.tags.map((tag) => (
                <span key={tag} className="poet-tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 全文 */}
          <div className="relative">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="h-px flex-1 bg-[#d4c4b7]/70" />
              <span className="text-[11px] sm:text-[12px] tracking-[0.4em] text-[#a89e89] font-mono-design">
                FULL TEXT · 全文
              </span>
              <span className="text-[12px] sm:text-[14px] tracking-[0.2em] text-[#6b6458]">
                {poet.works_short && `《${poet.works_short}》`}
              </span>
              <div className="h-px flex-1 bg-[#d4c4b7]/70" />
            </div>
            {renderWorks()}
          </div>
        </div>

        {/* 底栏 */}
        <div className="shrink-0 mx-6 sm:mx-12 h-px bg-[#d4c4b7]" />
        <div className="shrink-0 px-6 sm:px-12 pt-3.5 sm:pt-4 pb-5 sm:pb-6 flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[14px] sm:text-[16px] font-bold text-[#2c2c2c] tracking-[0.4em] leading-none">
              能力 · 单人详情
            </span>
            <span className="font-mono-design text-[9px] sm:text-[10px] text-[#a89e89] tracking-[0.3em] mt-1">
              POET DETAIL
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {hasConnections && onShowGraph && (
              <button
                onClick={() => onShowGraph(poet)}
                className="cta-tang text-[12px] sm:text-[13px]"
              >
                <Network size={14} />
                看人物关系网络
              </button>
            )}
            <button onClick={onClose} className="cta-ink text-[12px] sm:text-[13px]">
              返回时间轴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
