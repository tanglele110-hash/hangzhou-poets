import React from 'react';
import type { PositionedPoet } from '../types';
import { START_YEAR, SCALE, PERIODS, EVENTS } from '../constants';
import { PoetCard } from './PoetCard';

interface TimelineBodyProps {
  decades: number[];
  activeTags: ReadonlySet<string>;
  positionedPoets: PositionedPoet[];
  totalColumnsWidth: number;
  onSelectPoet: (poet: PositionedPoet) => void;
  onShowGraph: (poet: PositionedPoet) => void;
}

function poetMatchesTag(poetTags: string[], tag: string): boolean {
  if (poetTags.includes(tag)) return true;
  // "诗人" / "词人" 同时覆盖 "双擅"
  if ((tag === '诗人' || tag === '词人') && poetTags.includes('双擅'))
    return true;
  return false;
}

export const TimelineBody: React.FC<TimelineBodyProps> = React.memo(
  ({
    decades,
    activeTags,
    positionedPoets,
    totalColumnsWidth,
    onSelectPoet,
    onShowGraph,
  }) => (
    <>
      {/* Events column */}
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-[160px]">
        {EVENTS.map((event) => (
          <div
            key={event.name}
            className="absolute left-4 flex items-center gap-2 whitespace-nowrap rounded-md border border-gray-200/80 bg-[#f4f1e8]/95 px-2.5 py-1.5 shadow-sm"
            style={{
              top: `${(event.start - START_YEAR) * SCALE + (event.yOffset ?? 0)}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <span className="font-mono text-[11px] font-bold text-[#b83b3b]/80">
              {event.start}年
              {event.start !== event.end ? `-${event.end}年` : ''}
            </span>
            <span className="text-[12px] font-bold tracking-wider text-[#333]">
              {event.name}
            </span>
          </div>
        ))}
      </div>

      {/* Period bands */}
      <div className="absolute top-0 right-[160px] z-0 h-full w-[80px] border-l border-gray-300/50">
        {PERIODS.map((period) => (
          <div
            key={period.name}
            className="pattern-cloud absolute flex w-full items-center justify-center border-b border-gray-300/30"
            style={{
              top: `${(period.start - START_YEAR) * SCALE}px`,
              height: `${(period.end - period.start) * SCALE}px`,
              backgroundColor: period.color,
              opacity: 0.9,
            }}
          >
            <span className="vertical-text text-4xl font-black tracking-[0.2em] text-gray-800/60 drop-shadow-sm">
              {period.name}
            </span>
          </div>
        ))}
      </div>

      {/* Decade markers */}
      <div className="pointer-events-none absolute top-0 right-[240px] z-0 h-full w-[60px]">
        {decades.map((year) => (
          <div
            key={year}
            className="absolute flex w-full items-center"
            style={{ top: `${(year - START_YEAR) * SCALE}px` }}
          >
            <div className="w-full border-t border-gray-300/50" />
            <span className="absolute -top-2.5 right-2 bg-[#f4f1e8] px-1 font-mono text-[11px] font-bold text-gray-500">
              {year}
            </span>
          </div>
        ))}
      </div>

      {/* Poet cards */}
      <div
        className="absolute top-0 right-[320px] h-full"
        style={{ width: `${totalColumnsWidth}px` }}
      >
        {positionedPoets.map((poet) => {
          // 多选标签：要求每个被选标签都命中（"与"逻辑）
          const dimmed =
            activeTags.size > 0 &&
            ![...activeTags].every((tag) => poetMatchesTag(poet.tags, tag));
          return (
            <PoetCard
              key={poet.name}
              poet={poet}
              dimmed={dimmed}
              onClick={() => onSelectPoet(poet)}
              onShowGraph={onShowGraph}
            />
          );
        })}
      </div>
    </>
  ),
);

TimelineBody.displayName = 'TimelineBody';
