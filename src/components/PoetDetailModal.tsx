import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { PositionedPoet } from '../types';

interface PoetDetailModalProps {
  poet: PositionedPoet;
  onClose: () => void;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; lines: string[] | null }
  | { status: 'error'; message: string };

export const PoetDetailModal: React.FC<PoetDetailModalProps> = ({
  poet,
  onClose,
}) => {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* 桌面：竖排（vertical-rl），移动：横排 */}
      <div
        className="poet-detail-card relative bg-texture border border-[#d4c4b7] shadow-2xl p-6 sm:p-12 pointer-events-auto max-h-[85vh] max-w-[92vw] sm:max-w-[80vw] overflow-x-auto overflow-y-auto hide-scrollbar rounded-sm"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:left-4 sm:right-auto text-gray-500 hover:text-[#b83b3b] transition-colors z-10"
          aria-label="关闭"
        >
          <X size={28} />
        </button>

        <div className="poet-detail-meta border-b sm:border-b-0 sm:border-l border-gray-300/60 pb-4 sm:pb-0 sm:pl-8 sm:ml-8 shrink-0 flex flex-col gap-3 sm:gap-6 sm:items-end">
          <h2 className="text-2xl sm:text-4xl font-black tracking-[0.2em] text-[#b83b3b] m-0">
            {poet.works_short}
          </h2>
          <div>
            <span className="text-base sm:text-xl text-gray-700 tracking-[0.2em] font-bold">
              {poet.name}
            </span>
            <span className="ml-3 sm:ml-0 sm:mt-6 sm:inline-block text-xs sm:text-sm text-gray-500 border border-gray-400/50 px-1 py-0.5 rounded-sm">
              {poet.era}
            </span>
          </div>
        </div>

        <div className="text-lg sm:text-2xl leading-relaxed text-gray-800 tracking-[0.15em] font-medium mt-6 sm:mt-24">
          {state.status === 'loading' && (
            <div className="text-gray-400 text-base sm:text-lg">加载中…</div>
          )}
          {state.status === 'error' && (
            <div className="text-[#b83b3b] text-base sm:text-lg">
              加载失败：{state.message}
            </div>
          )}
          {state.status === 'ready' && state.lines ? (
            state.lines.map((line, i) => (
              <p
                key={i}
                className="m-0 sm:ml-4 sm:whitespace-nowrap whitespace-normal"
              >
                {line}
              </p>
            ))
          ) : state.status === 'ready' && !state.lines ? (
            <div className="text-gray-400 italic text-base sm:text-lg">
              <p>暂未收录全文，敬请期待。</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
