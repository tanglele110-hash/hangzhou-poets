import React from 'react';
import { Network } from 'lucide-react';
import type { PositionedPoet } from '../types';
import { KNOWN_RELATIONSHIPS } from '../data';
import { getPoetColor } from '../constants';
import { cardWidthForPoet } from '../utils';
import { START_YEAR, SCALE } from '../constants';

interface PoetCardProps {
  poet: PositionedPoet;
  dimmed: boolean;
  onClick: () => void;
  onShowGraph: (poet: PositionedPoet) => void;
}

export const PoetCard: React.FC<PoetCardProps> = React.memo(
  ({ poet, dimmed, onClick, onShowGraph }) => {
    const top = (poet.birth_year - START_YEAR) * SCALE;
    const height = (poet.death_year - poet.birth_year) * SCALE;
    const rightPx = poet.columnRightOffset;

    const isCore = poet.weight === 3;
    const isMajor = poet.weight === 2;
    const cardWidth = cardWidthForPoet(poet);
    const color = getPoetColor(poet.weight);

    const bgClass = isCore
      ? 'bg-[#b83b3b]/10'
      : isMajor
        ? 'bg-[#4a6b8c]/10'
        : 'bg-[#5c7a6b]/10';
    const hoverBgClass = isCore
      ? 'hover:bg-[#b83b3b]/20'
      : isMajor
        ? 'hover:bg-[#4a6b8c]/20'
        : 'hover:bg-[#5c7a6b]/20';
    const yearBadgeClass =
      'absolute z-10 rounded-sm bg-[#f4f1e8]/95 px-1 py-[1px] font-mono text-[10px] leading-none whitespace-nowrap shadow-sm pointer-events-none';

    const hasConnections = KNOWN_RELATIONSHIPS.some(
      (rel) => rel.source === poet.name || rel.target === poet.name,
    );

    return (
      <div
        onClick={onClick}
        className={`absolute flex flex-row-reverse items-start justify-center group hover:z-50 transition-all duration-300 ${bgClass} ${hoverBgClass} border-t border-b cursor-pointer ${dimmed ? 'opacity-10 pointer-events-none' : ''}`}
        style={{
          top: `${top}px`,
          right: `${rightPx}px`,
          width: `${cardWidth}px`,
          height: `${height}px`,
          borderColor: `${color}40`,
        }}
      >
        {/* Lifespan Line */}
        <div
          className="absolute right-0 top-0 w-px h-full transition-colors duration-300"
          style={{ backgroundColor: `${color}60` }}
        >
          <div
            className="absolute top-0 -left-1 w-2 h-px"
            style={{ backgroundColor: color }}
          />
          <div
            className="absolute bottom-0 -left-1 w-2 h-px"
            style={{ backgroundColor: color }}
          />
          <div
            className={yearBadgeClass}
            style={{
              color,
              right: '-1px',
              top: '-16px',
              transform: 'translateX(50%)',
            }}
          >
            {poet.unknown_dates ? '生卒年不详' : poet.birth_year}
          </div>
          {!poet.unknown_dates && (
            <div
              className={yearBadgeClass}
              style={{
                color,
                right: '-1px',
                bottom: '-16px',
                transform: 'translateX(50%)',
              }}
            >
              {poet.death_year}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={`flex flex-row-reverse gap-1.5 py-2 w-full h-full overflow-visible justify-center ${isCore ? 'pl-4 pr-4' : 'pl-2 pr-4'}`}
        >
          <div
            className="vertical-text tracking-[0.1em] drop-shadow-sm shrink-0"
            style={{
              color,
              fontSize: isCore ? '42px' : isMajor ? '28px' : '18px',
              fontWeight: isCore ? 900 : isMajor ? 800 : 700,
              lineHeight: 1.1,
            }}
          >
            {poet.name}
          </div>

          <div className="flex flex-col items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1 items-center mt-1 w-full px-1">
              {poet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold border-[1.5px] px-1 py-0.5 text-center rounded-sm bg-white/90 max-w-[80px]"
                  style={{ borderColor: `${color}60`, color }}
                >
                  {tag}
                </span>
              ))}
              {hasConnections && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowGraph(poet);
                  }}
                  className="mt-1 text-[10px] font-bold border-[1.5px] px-1 py-0.5 text-center rounded-sm transition-colors flex flex-col items-center gap-0.5"
                  style={{
                    borderColor: color,
                    color: '#fff',
                    backgroundColor: color,
                  }}
                  title="人物关系"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${color}dd`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = color)
                  }
                >
                  <Network size={10} />
                  <span>关系</span>
                </button>
              )}
            </div>
            <div className="flex flex-row-reverse gap-1 mt-2">
              <div
                className="vertical-text text-sm font-bold"
                style={{ color: '#222' }}
              >
                {poet.short_desc}
              </div>
              <div
                className="vertical-text text-xs italic border-r pr-1"
                style={{ color: '#666', borderColor: `${color}40` }}
              >
                《{poet.works_short}》
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PoetCard.displayName = 'PoetCard';
