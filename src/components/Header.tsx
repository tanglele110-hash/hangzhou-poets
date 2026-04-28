import React, { useEffect, useState } from 'react';
import { Download, Network, X, SlidersHorizontal } from 'lucide-react';
import { PERIODS, TAG_GROUPS } from '../constants';

interface HeaderProps {
  isExporting: boolean;
  activeTags: ReadonlySet<string>;
  onExport: () => void;
  onShowGlobalGraph: () => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onJumpToPeriod: (year: number) => void;
}

const LegendItem: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div className="flex items-center gap-1.5">
    <span
      className="inline-block h-4 w-4 shrink-0 rounded-sm shadow-sm"
      style={{ backgroundColor: color }}
    />
    {label}
  </div>
);

const TagButton: React.FC<{
  tag: string;
  active: boolean;
  onClick: () => void;
}> = ({ tag, active, onClick }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer rounded-sm border-2 px-1.5 py-0.5 font-black transition-colors ${
      active
        ? 'border-[#b83b3b] bg-[#b83b3b] text-white'
        : 'border-gray-400 bg-white/90 text-gray-600 hover:border-[#b83b3b]/60 hover:text-[#b83b3b]'
    }`}
  >
    {tag}
  </button>
);

const PeriodNav: React.FC<{ onJump: (year: number) => void }> = ({
  onJump,
}) => (
  <div className="flex flex-wrap items-center gap-1.5 text-xs">
    <span className="font-bold text-gray-500">跳到：</span>
    {PERIODS.map((p) => (
      <button
        key={p.name}
        onClick={() => onJump(p.start)}
        className="rounded-sm border border-[#b83b3b]/30 bg-white/85 px-2 py-0.5 font-bold tracking-wider text-[#b83b3b] hover:bg-[#b83b3b]/10"
        title={`${p.start}–${p.end} 年`}
      >
        {p.name}
      </button>
    ))}
  </div>
);

const ActiveTagBar: React.FC<{
  activeTags: ReadonlySet<string>;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}> = ({ activeTags, onToggleTag, onClearTags }) => {
  if (activeTags.size === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="font-bold text-gray-500">
        已选 {activeTags.size}（与）：
      </span>
      {[...activeTags].map((tag) => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className="flex items-center gap-1 rounded-sm border-2 border-[#b83b3b] bg-[#b83b3b] px-1.5 py-0.5 font-black text-white"
        >
          {tag}
          <X size={10} strokeWidth={3} />
        </button>
      ))}
      <button
        onClick={onClearTags}
        className="rounded-sm border border-gray-400 bg-white/90 px-1.5 py-0.5 font-bold text-gray-600 hover:border-[#b83b3b]/60 hover:text-[#b83b3b]"
      >
        清除
      </button>
    </div>
  );
};

// 移动端紧凑顶栏：标题+副标题 / 操作图标+图例 / 筛选漏斗
const MobileBar: React.FC<{
  isExporting: boolean;
  activeTagCount: number;
  onExport: () => void;
  onShowGlobalGraph: () => void;
  onOpenDrawer: () => void;
}> = ({
  isExporting,
  activeTagCount,
  onExport,
  onShowGlobalGraph,
  onOpenDrawer,
}) => (
  <div className="flex flex-col xl:hidden">
    {/* Row 1: 标题 + 副标题 | 筛选 */}
    <div className="flex items-start justify-between gap-2 px-3 py-2">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[1.15rem] font-black leading-tight tracking-widest text-[#b83b3b] drop-shadow-sm">
          杭州唐宋诗词名家
        </h1>
        <p className="mt-0.5 truncate text-[11px] font-bold tracking-widest text-gray-500">
          钱塘自古繁华，文人墨客荟萃
        </p>
      </div>
      <button
        onClick={onOpenDrawer}
        className="relative flex shrink-0 items-center gap-1 rounded-sm border border-gray-400 bg-white/90 px-2 py-1 text-xs font-bold text-gray-700 hover:border-[#b83b3b]/60 hover:text-[#b83b3b]"
        aria-label="筛选"
      >
        <SlidersHorizontal size={14} />
        <span className="tracking-wider">筛选</span>
        {activeTagCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#b83b3b] px-1 text-[10px] font-black leading-none text-white shadow">
            {activeTagCount}
          </span>
        )}
      </button>
    </div>

    {/* Row 2: 操作按钮 | 分隔 | 图例（横向可滚动以兼容窄屏） */}
    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-t border-gray-200/70 px-3 py-1.5 text-xs">
      <button
        onClick={onExport}
        disabled={isExporting}
        className="flex shrink-0 items-center gap-1 rounded-sm bg-[#b83b3b] px-2 py-1 text-white shadow-sm transition-colors hover:bg-[#8a2c2c] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="生成长图"
      >
        <Download size={13} />
        <span className="font-bold tracking-wider">
          {isExporting ? '生成中' : '长图'}
        </span>
      </button>
      <button
        onClick={onShowGlobalGraph}
        className="flex shrink-0 items-center gap-1 rounded-sm border border-[#b83b3b]/30 bg-[#f4f1e8] px-2 py-1 text-[#b83b3b] transition-colors hover:bg-[#b83b3b]/10"
        aria-label="全景关系图谱"
      >
        <Network size={13} />
        <span className="font-bold tracking-wider">关系图</span>
      </button>
      <span className="mx-1 h-4 w-px shrink-0 bg-gray-300" />
      <div className="flex shrink-0 items-center gap-3 font-bold text-gray-700">
        <LegendItem color="#b83b3b" label="核心代表" />
        <LegendItem color="#4a6b8c" label="重要名家" />
        <LegendItem color="#5c7a6b" label="知名文人" />
      </div>
    </div>
  </div>
);

// 移动端筛选抽屉：全屏覆盖，只做筛选
const MobileDrawer: React.FC<{
  open: boolean;
  activeTags: ReadonlySet<string>;
  onClose: () => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}> = ({ open, activeTags, onClose, onToggleTag, onClearTags }) => {
  // 抽屉打开时锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#f4f1e8] xl:hidden">
      <div className="flex items-center justify-between border-b border-gray-300/80 bg-[#f4f1e8]/95 px-4 py-3 shadow-sm backdrop-blur">
        <h2 className="text-base font-black tracking-widest text-[#b83b3b]">
          标签筛选
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-gray-600 hover:bg-white"
          aria-label="关闭"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-auto px-4 py-4 pb-24">
        <ActiveTagBar
          activeTags={activeTags}
          onToggleTag={onToggleTag}
          onClearTags={onClearTags}
        />
        <div className="flex flex-col gap-3">
          {TAG_GROUPS.map((g) => (
            <div
              key={g.prefix}
              className="flex flex-wrap items-center gap-2 text-xs text-gray-600"
            >
              <span className="font-bold text-gray-500">{g.prefix}：</span>
              {g.tags.map((tag) => (
                <TagButton
                  key={tag}
                  tag={tag}
                  active={activeTags.has(tag)}
                  onClick={() => onToggleTag(tag)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    isExporting,
    activeTags,
    onExport,
    onShowGlobalGraph,
    onToggleTag,
    onClearTags,
    onJumpToPeriod,
  }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <>
        <header className="fixed top-0 left-0 z-[100] w-full border-b border-gray-300/80 bg-[#f4f1e8]/95 backdrop-blur-md shadow-sm xl:flex xl:items-end xl:justify-between xl:px-8 xl:py-5">
          {/* Mobile compact bar */}
          <MobileBar
            isExporting={isExporting}
            activeTagCount={activeTags.size}
            onExport={onExport}
            onShowGlobalGraph={onShowGlobalGraph}
            onOpenDrawer={() => setDrawerOpen(true)}
          />

          {/* Desktop layout (unchanged) */}
          <div className="hidden w-full xl:flex xl:items-end xl:justify-between xl:px-0 xl:py-0">
            <div>
              <div className="flex items-center gap-6">
                <h1 className="text-[3.6rem] font-black leading-tight tracking-widest text-[#b83b3b] drop-shadow-sm">
                  杭州唐宋诗词名家图鉴
                </h1>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={onExport}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-1.5 rounded-sm bg-[#b83b3b] px-3 py-1.5 text-sm text-[#f4f1e8] shadow-sm transition-colors hover:bg-[#8a2c2c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={17} />
                    <span className="font-bold tracking-widest">
                      {isExporting ? '生成中...' : '生成长图'}
                    </span>
                  </button>
                  <button
                    onClick={onShowGlobalGraph}
                    className="flex items-center justify-center gap-1.5 rounded-sm border border-[#b83b3b]/30 bg-[#f4f1e8] px-3 py-1 text-xs text-[#b83b3b] shadow-sm transition-colors hover:bg-[#b83b3b]/10"
                  >
                    <Network size={14} />
                    <span className="font-bold tracking-widest">
                      全景关系图谱
                    </span>
                  </button>
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-widest text-gray-700">
                钱塘自古繁华，文人墨客荟萃
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <PeriodNav onJump={onJumpToPeriod} />
                <ActiveTagBar
                  activeTags={activeTags}
                  onToggleTag={onToggleTag}
                  onClearTags={onClearTags}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <div className="flex gap-5 text-sm font-bold text-gray-700">
                <LegendItem color="#b83b3b" label="核心代表" />
                <LegendItem color="#4a6b8c" label="重要名家" />
                <LegendItem color="#5c7a6b" label="知名文人" />
              </div>
              <div className="mt-1 flex flex-col gap-2 items-end">
                {TAG_GROUPS.map((g) => (
                  <div
                    key={g.prefix}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span className="mr-1 font-bold text-gray-500">
                      {g.prefix}：
                    </span>
                    {g.tags.map((tag) => (
                      <TagButton
                        key={tag}
                        tag={tag}
                        active={activeTags.has(tag)}
                        onClick={() => onToggleTag(tag)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <MobileDrawer
          open={drawerOpen}
          activeTags={activeTags}
          onClose={() => setDrawerOpen(false)}
          onToggleTag={onToggleTag}
          onClearTags={onClearTags}
        />
      </>
    );
  },
);

Header.displayName = 'Header';
