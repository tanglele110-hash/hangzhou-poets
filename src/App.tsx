import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  Suspense,
} from 'react';
import { poets, type Poet } from './data';
import type { PositionedPoet } from './types';
import { SCALE, START_YEAR, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from './constants';
import { computeLayout, computeDecades, exportTimelineAsImage } from './utils';
import { Header } from './components/Header';
import { TimelineBody } from './components/TimelineBody';
import { PoetDetailModal } from './components/PoetDetailModal';
import { useHashRoute } from './hooks/useHashRoute';

const RelationshipGraph = React.lazy(() =>
  import('./components/RelationshipGraph').then((m) => ({
    default: m.RelationshipGraph,
  })),
);
const GlobalRelationshipGraph = React.lazy(() =>
  import('./components/GlobalRelationshipGraph').then((m) => ({
    default: m.GlobalRelationshipGraph,
  })),
);

const layout = computeLayout(poets);
const decades = computeDecades();

export default function App() {
  const [route, navigate] = useHashRoute();
  const [isExporting, setIsExporting] = useState(false);
  const [activeTags, setActiveTags] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [timelineZoom, setTimelineZoom] = useState(1);

  const findPositionedPoet = useCallback(
    (poetOrName: Poet | string): PositionedPoet | undefined => {
      const name = typeof poetOrName === 'string' ? poetOrName : poetOrName.name;
      return layout.positionedPoets.find((p) => p.name === name);
    },
    [],
  );

  const selectedPoet =
    route.kind === 'poet' ? (findPositionedPoet(route.name) ?? null) : null;
  const selectedPoetForGraph =
    route.kind === 'graphFor' ? (findPositionedPoet(route.name) ?? null) : null;
  const showGlobalGraph = route.kind === 'graph';

  const mainScrollRef = useRef<HTMLElement>(null);
  const zoomRef = useRef(1);
  const pendingZoomRef = useRef<{
    offsetX: number;
    offsetY: number;
    viewportX: number;
    viewportY: number;
    prevZoom: number;
    nextZoom: number;
  } | null>(null);

  const toggleTag = useCallback((tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const clearTags = useCallback(() => setActiveTags(new Set()), []);

  const scrollToYear = useCallback(
    (year: number) => {
      const el = mainScrollRef.current;
      if (!el) return;
      // <main> 在普通文档流里没有内部滚动条，整个页面是 window 滚动；
      // 所以要算 main 在 document 中的绝对 Y，再叠上年份在 timeline 里的 offset。
      const mainAbsTop = el.getBoundingClientRect().top + window.scrollY;
      const yearOffsetInMain = (year - START_YEAR) * SCALE * timelineZoom;
      const targetY = Math.max(
        0,
        mainAbsTop + yearOffsetInMain - window.innerHeight * 0.18,
      );
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [timelineZoom],
  );

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportTimelineAsImage(
        layout.positionedPoets,
        layout.timelineWidth,
        layout.totalHeight,
      );
    } catch (err) {
      console.error('Export failed:', err);
      alert(
        '导出失败: ' + (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleShowGlobalGraph = useCallback(
    () => navigate({ kind: 'graph' }),
    [navigate],
  );

  const handleSelectPoet = useCallback(
    (poet: PositionedPoet) => navigate({ kind: 'poet', name: poet.name }),
    [navigate],
  );

  const handleShowGraph = useCallback(
    (poet: PositionedPoet) => navigate({ kind: 'graphFor', name: poet.name }),
    [navigate],
  );

  const handleGraphNodeClick = useCallback(
    (poet: Poet) => {
      navigate({ kind: 'poet', name: poet.name });
    },
    [navigate],
  );

  const goHome = useCallback(() => navigate({ kind: 'home' }), [navigate]);

  const clampZoom = useCallback(
    (zoom: number) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom * 1000) / 1000)),
    [],
  );

  const computeFitZoom = useCallback(() => {
    const el = mainScrollRef.current;
    if (!el) return 1;
    const availableWidth = Math.max(el.clientWidth - 48, 320);
    const availableHeight = Math.max(el.clientHeight - 48, 320);
    return clampZoom(
      Math.min(
        availableWidth / layout.timelineWidth,
        availableHeight / layout.totalHeight,
      ),
    );
  }, [clampZoom]);

  // 首次挂载后：在窄屏自动进入"全貌"模式（避免移动端打开就被局部内容轰炸）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 1024) return; // 桌面保持 100%
    // 等 main 拿到尺寸后再算
    const id = requestAnimationFrame(() => {
      const fit = computeFitZoom();
      setTimelineZoom(fit);
    });
    return () => cancelAnimationFrame(id);
    // 仅在挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomTo = useCallback(
    (nextZoom: number, anchor?: { clientX: number; clientY: number }) => {
      const el = mainScrollRef.current;
      if (!el) return;

      setTimelineZoom((prevZoom) => {
        const normalized = clampZoom(nextZoom);
        if (normalized === prevZoom) return prevZoom;

        const rect = el.getBoundingClientRect();
        const viewportX = anchor ? anchor.clientX - rect.left : el.clientWidth / 2;
        const viewportY = anchor ? anchor.clientY - rect.top : el.clientHeight / 2;

        pendingZoomRef.current = {
          offsetX: el.scrollLeft + viewportX,
          offsetY: el.scrollTop + viewportY,
          viewportX,
          viewportY,
          prevZoom,
          nextZoom: normalized,
        };

        return normalized;
      });
    },
    [clampZoom],
  );

  useEffect(() => {
    zoomRef.current = timelineZoom;
  }, [timelineZoom]);

  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el) return;

    let rafId = 0;
    let lastAnchor: { clientX: number; clientY: number } | null = null;
    let accumulatedDelta = 0;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const rect = el.getBoundingClientRect();
      const insideMain =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      lastAnchor = insideMain
        ? { clientX: event.clientX, clientY: event.clientY }
        : {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          };
      accumulatedDelta += event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const nextZoom = zoomRef.current + accumulatedDelta;
        zoomTo(nextZoom, lastAnchor ?? undefined);
        accumulatedDelta = 0;
        rafId = 0;
      });
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', onWheel, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [zoomTo]);

  // 触屏 pinch-zoom
  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el) return;

    let pinchStartDist = 0;
    let pinchStartZoom = 1;
    let pinchAnchor: { clientX: number; clientY: number } | null = null;

    const distance = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStartDist = distance(e.touches[0], e.touches[1]);
        pinchStartZoom = zoomRef.current;
        pinchAnchor = {
          clientX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          clientY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist > 0) {
        e.preventDefault();
        const d = distance(e.touches[0], e.touches[1]);
        zoomTo(pinchStartZoom * (d / pinchStartDist), pinchAnchor ?? undefined);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchStartDist = 0;
        pinchAnchor = null;
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [zoomTo]);

  useLayoutEffect(() => {
    const el = mainScrollRef.current;
    const pending = pendingZoomRef.current;
    if (!el || !pending) return;

    const ratio = pending.nextZoom / pending.prevZoom;
    el.scrollLeft = pending.offsetX * ratio - pending.viewportX;
    el.scrollTop = pending.offsetY * ratio - pending.viewportY;
    pendingZoomRef.current = null;
  }, [timelineZoom]);

  const zoomStyle = useMemo(
    () => ({
      width: layout.timelineWidth,
      height: layout.totalHeight,
      transform: `scale(${timelineZoom})`,
      transformOrigin: 'top left' as const,
    }),
    [timelineZoom],
  );

  return (
    <div className="min-h-screen bg-texture text-[#2c2c2c] font-serif overflow-x-hidden">
      <Header
        isExporting={isExporting}
        activeTags={activeTags}
        onExport={handleExport}
        onShowGlobalGraph={handleShowGlobalGraph}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        onJumpToPeriod={scrollToYear}
      />

      <main
        ref={mainScrollRef}
        className="relative mb-20 mt-[100px] w-full overflow-auto xl:mt-48"
      >
        <div
          className="relative isolate mx-auto"
          style={{
            width: layout.timelineWidth * timelineZoom,
            height: layout.totalHeight * timelineZoom,
          }}
        >
          {/* Watermark — scrolls with content, behind everything */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
            style={{ zIndex: -1 }}
          >
            <div className="text-center text-[10vw] font-black leading-[1.4] tracking-[0.3em] text-gray-300/18">
              <div>钱塘自古繁华</div>
              <div>文人墨客荟萃</div>
            </div>
          </div>

          <div className="absolute top-0 left-0 will-change-transform" style={zoomStyle}>
            <TimelineBody
              decades={decades}
              activeTags={activeTags}
              positionedPoets={layout.positionedPoets}
              totalColumnsWidth={layout.totalColumnsWidth}
              onSelectPoet={handleSelectPoet}
              onShowGraph={handleShowGraph}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 z-[120] flex items-center gap-2 rounded-md border border-gray-300/80 bg-[#f4f1e8]/95 px-2 py-2 shadow-sm backdrop-blur">
        <button
          onClick={() => zoomTo(timelineZoom - ZOOM_STEP)}
          className="rounded border border-gray-300 px-2 py-1 text-sm font-bold text-gray-700 hover:bg-white"
          aria-label="缩小"
        >
          -
        </button>
        <button
          onClick={() => zoomTo(computeFitZoom())}
          className="rounded border border-[#b83b3b]/30 px-2 py-1 text-sm font-bold text-[#b83b3b] hover:bg-white"
        >
          全貌
        </button>
        <button
          onClick={() => zoomTo(1)}
          className="rounded border border-gray-300 px-2 py-1 text-sm font-bold text-gray-700 hover:bg-white"
        >
          100%
        </button>
        <button
          onClick={() => zoomTo(timelineZoom + ZOOM_STEP)}
          className="rounded border border-gray-300 px-2 py-1 text-sm font-bold text-gray-700 hover:bg-white"
          aria-label="放大"
        >
          +
        </button>
        <div className="min-w-[52px] text-center text-sm font-bold text-gray-600">
          {Math.round(timelineZoom * 100)}%
        </div>
      </div>

      {selectedPoet && (
        <PoetDetailModal
          poet={selectedPoet}
          onClose={goHome}
          onShowGraph={(p) => navigate({ kind: 'graphFor', name: p.name })}
        />
      )}

      <Suspense fallback={null}>
        {selectedPoetForGraph && (
          <RelationshipGraph
            centerPoet={selectedPoetForGraph}
            allPoets={poets}
            onClose={goHome}
            onOpenGlobalGraph={() => navigate({ kind: 'graph' })}
            onNodeClick={handleGraphNodeClick}
          />
        )}

        {showGlobalGraph && (
          <GlobalRelationshipGraph
            allPoets={poets}
            onClose={goHome}
            onNodeClick={(poet) => navigate({ kind: 'poet', name: poet.name })}
          />
        )}
      </Suspense>
    </div>
  );
}
