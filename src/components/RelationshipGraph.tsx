import React, { useEffect, useMemo, useRef } from 'react';
import { select, type BaseType, type Selection } from 'd3-selection';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { zoom } from 'd3-zoom';
import { drag, type D3DragEvent } from 'd3-drag';
import { Network, X } from 'lucide-react';
import type { Poet } from '../data';
import { KNOWN_RELATIONSHIPS } from '../data';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  poet: Poet;
  isCenter: boolean;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
  label: string;
  isDirect: boolean;
}

interface RelationshipGraphProps {
  centerPoet: Poet;
  allPoets: Poet[];
  onClose: () => void;
  onNodeClick?: (poet: Poet) => void;
  onOpenGlobalGraph?: () => void;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  centerPoet,
  allPoets,
  onClose,
  onNodeClick,
  onOpenGlobalGraph,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const directLinks = useMemo(
    () =>
      KNOWN_RELATIONSHIPS.filter(
        (rel) => rel.source === centerPoet.name || rel.target === centerPoet.name,
      ),
    [centerPoet.name],
  );

  const hasConnections = directLinks.length > 0;
  const directCount = directLinks.length;
  const directLabels = useMemo(
    () => new Set(directLinks.map((r) => r.label)),
    [directLinks],
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    const centerNode: GraphNode = { id: centerPoet.name, poet: centerPoet, isCenter: true };
    nodes.push(centerNode);

    const connectedPoets: Poet[] = [];
    const addedNodeIds = new Set<string>();
    addedNodeIds.add(centerPoet.name);

    KNOWN_RELATIONSHIPS.forEach((rel) => {
      if (rel.source === centerPoet.name || rel.target === centerPoet.name) {
        const otherName = rel.source === centerPoet.name ? rel.target : rel.source;
        const otherPoet = allPoets.find((p) => p.name === otherName);
        if (otherPoet && !addedNodeIds.has(otherName)) {
          connectedPoets.push(otherPoet);
          nodes.push({ id: otherName, poet: otherPoet, isCenter: false });
          addedNodeIds.add(otherName);
          links.push({
            source: centerPoet.name,
            target: otherName,
            strength: 1,
            label: rel.label,
            isDirect: true,
          });
        }
      }
    });

    for (let i = 0; i < connectedPoets.length; i++) {
      for (let j = i + 1; j < connectedPoets.length; j++) {
        const p1 = connectedPoets[i];
        const p2 = connectedPoets[j];
        const rel = KNOWN_RELATIONSHIPS.find(
          (r) =>
            (r.source === p1.name && r.target === p2.name) ||
            (r.source === p2.name && r.target === p1.name),
        );
        if (rel) {
          links.push({
            source: p1.name,
            target: p2.name,
            strength: 0.5,
            label: rel.label,
            isDirect: false,
          });
        }
      }
    }

    select(svgRef.current).selectAll('*').remove();

    const svg = select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');

    const g = svg.append('g');
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoomBehavior);

    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(170)
          .strength((d) => d.strength * 0.3),
      )
      .force('charge', forceManyBody().strength(-900))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide().radius(64));

    // —— Layer 1: 链接曲线（在底） ——
    const linkPaths = g
      .append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.isDirect ? '#b83b3b' : '#a89e89'))
      .attr('stroke-opacity', (d) => (d.isDirect ? 0.55 : 0.45))
      .attr('stroke-width', (d) => (d.isDirect ? 2.2 : 1.4))
      .attr('stroke-dasharray', (d) => (d.isDirect ? null : '4,4'));

    // —— Layer 2: 节点（在中间） ——
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (event.defaultPrevented) return;
        if (onNodeClick) onNodeClick(d.poet);
      })
      .call(
        drag<SVGGElement, GraphNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as unknown as (
          selection: Selection<SVGGElement | BaseType, GraphNode, SVGGElement, unknown>,
        ) => void,
      );

    node
      .append('circle')
      .attr('r', (d) => (d.isCenter ? 36 : 26))
      .attr('fill', (d) => {
        if (d.isCenter) return '#b83b3b';
        if (d.poet.weight === 3) return '#b83b3b';
        if (d.poet.weight === 2) return '#4a6b8c';
        return '#5c7a6b';
      })
      .attr('stroke', '#faf9f5')
      .attr('stroke-width', 3)
      .attr('opacity', 0.94);

    // 中心节点：双圈环增强焦点感
    node
      .filter((d) => d.isCenter)
      .insert('circle', 'circle')
      .attr('r', 46)
      .attr('fill', 'none')
      .attr('stroke', '#b83b3b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,4')
      .attr('opacity', 0.55);

    node
      .append('text')
      .text((d) => d.poet.name)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .attr('font-size', (d) => (d.isCenter ? '17px' : '13px'))
      .attr('font-weight', 'bold')
      .attr('writing-mode', 'vertical-rl')
      .style('letter-spacing', '2px');

    // —— Layer 3: 链接 label（最上层，白底带边） ——
    const linkLabelGroup = g
      .append('g')
      .selectAll('g')
      .data(links)
      .join('g')
      .style('pointer-events', 'none');

    linkLabelGroup
      .append('rect')
      .attr('fill', '#fffef8')
      .attr('fill-opacity', 0.95)
      .attr('stroke', (d) => (d.isDirect ? 'rgba(184,59,59,0.45)' : '#d4c4b7'))
      .attr('stroke-width', 0.7)
      .attr('rx', 3)
      .attr('ry', 3);

    linkLabelGroup
      .append('text')
      .text((d) => d.label)
      .attr('fill', (d) => (d.isDirect ? '#b83b3b' : '#6b6458'))
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');

    function getLinkGeometry(d: GraphLink) {
      const s = d.source as GraphNode;
      const t = d.target as GraphNode;
      const sx = s.x ?? 0;
      const sy = s.y ?? 0;
      const tx = t.x ?? 0;
      const ty = t.y ?? 0;
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      const dx = tx - sx;
      const dy = ty - sy;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      // 曲线控制点：在两节点中点的法线方向偏移；直接关系略微更曲
      const lift = (d.isDirect ? 32 : 24) + Math.min(d.label.length * 4, 18);
      const nx = -dy / dist;
      const ny = dx / dist;
      const cx = mx + nx * lift;
      const cy = my + ny * lift;
      // label 落在曲线 t=0.5 处（quadratic Bezier midpoint = (S + 2C + T)/4）
      const lx = (sx + 2 * cx + tx) / 4;
      const ly = (sy + 2 * cy + ty) / 4;
      return { sx, sy, tx, ty, cx, cy, lx, ly };
    }

    simulation.on('tick', () => {
      linkPaths.attr('d', (d) => {
        const { sx, sy, tx, ty, cx, cy } = getLinkGeometry(d);
        return `M${sx},${sy}Q${cx},${cy},${tx},${ty}`;
      });

      linkLabelGroup.each(function (this: SVGGElement | BaseType, d) {
        const gEl = select(this as SVGGElement);
        const { lx, ly } = getLinkGeometry(d);
        const textEl = gEl.select('text').attr('x', lx).attr('y', ly).node() as SVGTextElement;
        if (textEl) {
          const bbox = textEl.getBBox();
          const pad = 4;
          gEl
            .select('rect')
            .attr('x', bbox.x - pad)
            .attr('y', bbox.y - pad)
            .attr('width', bbox.width + pad * 2)
            .attr('height', bbox.height + pad * 2);
        }
      });

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [centerPoet, allPoets, onNodeClick]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-[#1a1714]/55 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      <div
        className="relative bg-texture-vignette border border-[#d4c4b7] shadow-[0_30px_80px_-20px_rgba(20,15,5,0.55)]
                   w-full h-full max-w-[1400px] max-h-[94vh] rounded-sm overflow-hidden flex flex-col pointer-events-auto"
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
              RELATIONSHIP · SINGLE
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

        {/* 标题区 */}
        <div className="shrink-0 px-6 sm:px-12 pt-4 sm:pt-5 pb-2 sm:pb-3 relative">
          <div className="flex items-end gap-3 sm:gap-5 flex-wrap">
            <span className="label-pill-base label-pill-tang">
              单人关系
            </span>
            <h2 className="text-[20px] sm:text-[28px] font-black tracking-[0.16em] text-[#2c2c2c] m-0 leading-none">
              {centerPoet.name} · 人物关系网络
            </h2>
          </div>
          <p className="text-[11px] sm:text-[13px] text-[#6b6458] tracking-[0.2em] mt-2 sm:mt-3">
            朱实线 · 直接交往 ｜ 灰虚线 · 二度连接 ｜ 拖动节点重新布局 · 单击查看诗人详情
          </p>

          {/* 朱印 */}
          <div
            className="seal-stamp absolute top-3 sm:top-4 right-6 sm:right-12 w-[44px] h-[44px] sm:w-[56px] sm:h-[56px] text-[24px] sm:text-[30px] rounded-[2px] z-[2]"
            aria-hidden
          >
            关
          </div>
        </div>

        {/* Graph Container */}
        <div className="flex-1 w-full relative" ref={containerRef}>
          {!hasConnections && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#a89e89]">
              <Network size={48} className="mb-4 opacity-40" />
              <div className="text-base sm:text-lg font-bold tracking-[0.3em]">
                暂无该诗人的明确人物关系记录
              </div>
              <div className="text-[11px] sm:text-[12px] tracking-[0.2em] mt-2 text-[#a89e89]">
                历史所限，部分诗人交往未有充分记载
              </div>
            </div>
          )}
          <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>

          {/* 图例（左下角浮层） */}
          {hasConnections && (
            <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-[#fffef8]/85 border border-[#d4c4b7] rounded-sm px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm">
              <div className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#a89e89] mb-2 font-mono-design">
                LEGEND · 图例
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#2c2c2c]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#b83b3b]" />
                  <span className="tracking-[0.15em]">核心 / 中心</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#2c2c2c]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#4a6b8c]" />
                  <span className="tracking-[0.15em]">重要诗人</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#2c2c2c]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#5c7a6b]" />
                  <span className="tracking-[0.15em]">其他诗人</span>
                </div>
                <div className="h-px bg-[#d4c4b7]/70 my-1.5" />
                <div className="flex items-center gap-2 text-[11px] text-[#2c2c2c]">
                  <span className="w-6 h-px bg-[#b83b3b]" />
                  <span className="tracking-[0.15em] text-[#b83b3b]">直接交往</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#2c2c2c]">
                  <span
                    className="w-6 h-px"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #a89e89 50%, transparent 0%)',
                      backgroundSize: '6px 1px',
                      backgroundRepeat: 'repeat-x',
                    }}
                  />
                  <span className="tracking-[0.15em] text-[#6b6458]">二度连接</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底栏 */}
        <div className="shrink-0 mx-6 sm:mx-12 h-px bg-[#d4c4b7]" />
        <div className="shrink-0 px-6 sm:px-12 pt-3 sm:pt-4 pb-4 sm:pb-5 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[14px] sm:text-[16px] font-bold text-[#2c2c2c] tracking-[0.4em] leading-none">
              能力 · 关系网络
            </span>
            <span className="font-mono-design text-[9px] sm:text-[10px] text-[#a89e89] tracking-[0.3em] mt-1">
              SOCIAL NETWORK
            </span>
          </div>

          {/* stats（仅在有连接时显示） */}
          {hasConnections && (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <span className="font-mono-design text-[20px] sm:text-[26px] font-black text-[#b83b3b] leading-none">
                  {directCount}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#6b6458] tracking-[0.3em] mt-1">
                  位友人
                </span>
              </div>
              <div className="w-px h-8 bg-[#d4c4b7]" />
              <div className="flex flex-col items-center">
                <span className="font-mono-design text-[20px] sm:text-[26px] font-black text-[#4a6b8c] leading-none">
                  {directLabels.size}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#6b6458] tracking-[0.3em] mt-1">
                  类关系
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenGlobalGraph && (
              <button
                onClick={onOpenGlobalGraph}
                className="cta-tang text-[12px] sm:text-[13px]"
              >
                <Network size={14} />
                全景关系图
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
