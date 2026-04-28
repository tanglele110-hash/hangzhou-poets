import React, { useEffect, useRef } from 'react';
import { select, type BaseType, type Selection } from 'd3-selection';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Force,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { zoom, zoomIdentity } from 'd3-zoom';
import { drag, type D3DragEvent } from 'd3-drag';
import { X } from 'lucide-react';
import type { Poet } from '../data';
import { KNOWN_RELATIONSHIPS } from '../data';

const ERA_FILL: Record<string, string> = {
  初唐: '#F5F3F2',
  盛唐: '#EAE5E3',
  中唐: '#DFE0D9',
  晚唐: '#D4D3CA',
  五代: '#C9C8BE',
  北宋: '#BEBCAE',
  南宋: '#AFAEA0',
  宋: '#B8B6A4',
};

function baseNodeRadius(weight: number) {
  if (weight >= 3) return 18;
  if (weight === 2) return 16;
  return 12;
}

function nodeScaleMultiplier(weight: number) {
  if (weight === 2) return 1.6;
  return 1.8;
}

interface GlobalRelationshipGraphProps {
  allPoets: Poet[];
  onClose: () => void;
  onNodeClick?: (poet: Poet) => void;
}

interface GraphNode extends SimulationNodeDatum {
  id: string;
  poet: Poet;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  label: string;
}

export const GlobalRelationshipGraph: React.FC<GlobalRelationshipGraphProps> = ({ allPoets, onClose, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 1200;
    const height = containerRef.current.clientHeight || 800;

    const graphEraOf = (p: Poet) =>
      p.era === '宋' ? (p.birth_year < 1127 ? '北宋' : '南宋') : p.era;

    const links: GraphLink[] = KNOWN_RELATIONSHIPS
      .filter(rel => allPoets.some(p => p.name === rel.source) && allPoets.some(p => p.name === rel.target))
      .map(rel => ({
        source: rel.source,
        target: rel.target,
        label: rel.label,
      }));

    const poetByName: Record<string, Poet> = {};
    allPoets.forEach((poet) => {
      poetByName[poet.name] = poet;
    });

    const relationCounts: Record<string, number> = {};
    allPoets.forEach((poet) => {
      relationCounts[poet.name] = 0;
    });
    links.forEach((link) => {
      relationCounts[link.source as string] += 1;
      relationCounts[link.target as string] += 1;
    });

    const poetsWithGraphEra = allPoets.map(p => ({
      ...p,
      graphEra: graphEraOf(p),
    }));

    const poetsByEra: Record<string, Poet[]> = {};
    poetsWithGraphEra.forEach((poet) => {
      const era = poet.graphEra;
      if (!poetsByEra[era]) {
        poetsByEra[era] = [];
      }
      poetsByEra[era].push(poet);
    });

    function nodeRadius(poet: Poet) {
      const base = baseNodeRadius(poet.weight) * nodeScaleMultiplier(poet.weight);
      const relationBonus = Math.min((relationCounts[poet.name] ?? 0) * 2.2, 14);
      return base + relationBonus;
    }

    function nodeFontSize(poet: Poet) {
      const radius = nodeRadius(poet);
      if (radius >= 42) return '16px';
      if (radius >= 34) return '14px';
      if (radius >= 26) return '12px';
      return '10px';
    }

    const eras = Array.from(new Set(poetsWithGraphEra.map(p => p.graphEra))) as string[];
    const eraStats = eras.map(era => {
      const poetsInEra = poetsByEra[era] ?? [];
      const minYear = Math.min(...poetsInEra.map(p => p.birth_year));
      return { era, minYear, count: poetsInEra.length };
    }).sort((a, b) => a.minYear - b.minYear);
    const sortedEras = eraStats.map(e => e.era);

    const eraCounts: Record<string, number> = {};
    eraStats.forEach(e => { eraCounts[e.era] = e.count; });

    function eraRadius(era: string) {
      const poetsInEra = poetsByEra[era] ?? [];
      const occupiedArea = poetsInEra.reduce((sum, poet) => {
        const paddedRadius = nodeRadius(poet) + ((relationCounts[poet.name] ?? 0) > 0 ? 18 : 10);
        return sum + Math.PI * paddedRadius * paddedRadius;
      }, 0);
      const packingRadius = Math.sqrt(occupiedArea / Math.PI) * 1.35;
      const relationLoad = poetsInEra.reduce((sum, poet) => sum + (relationCounts[poet.name] ?? 0), 0);
      const countBonus = Math.sqrt(eraCounts[era] ?? 1) * 12;
      return Math.max(180, packingRadius + countBonus + Math.min(relationLoad * 3.6, 120));
    }

    const radii: Record<string, number> = {};
    sortedEras.forEach(e => { radii[e] = eraRadius(e); });

    const tangEras = sortedEras.filter(e => ['初唐','盛唐','中唐','晚唐'].includes(e));
    const songEras = sortedEras.filter(e => !['初唐','盛唐','中唐','晚唐'].includes(e)).reverse();

    const gap = 70;
    const eraCenters: Record<string, { x: number; y: number; r: number }> = {};

    function layoutRow(eras: string[], yCenter: number) {
      let curX = 0;
      eras.forEach(era => {
        const r = radii[era];
        curX += r;
        eraCenters[era] = { x: curX, y: yCenter, r };
        curX += r + gap;
      });
      const totalW = curX - gap;
      const offsetX = -totalW / 2;
      eras.forEach(era => { eraCenters[era].x += offsetX; });
      return totalW;
    }

    const row1MaxR = Math.max(...tangEras.map(e => radii[e]));
    const row2MaxR = Math.max(...songEras.map(e => radii[e]));
    const rowGap = 120;
    const row1Y = -(row1MaxR + rowGap / 2);
    const row2Y = row2MaxR + rowGap / 2;

    const totalW1 = layoutRow(tangEras, row1Y);
    const totalW2 = layoutRow(songEras, row2Y);
    const totalW = Math.max(totalW1, totalW2);
    const totalH = (row1MaxR * 2) + rowGap + (row2MaxR * 2);

    const nodes: GraphNode[] = [];
    sortedEras.forEach((era) => {
      const center = eraCenters[era];
      const centerX = center.x + width / 2;
      const centerY = center.y + height / 2;
      const poetsInEra = [...(poetsByEra[era] ?? [])].sort((a, b) => {
        return (relationCounts[b.name] ?? 0) - (relationCounts[a.name] ?? 0)
          || b.weight - a.weight
          || a.birth_year - b.birth_year;
      });
      const ringStep = Math.max(74, Math.min(center.r / 2.6, 96));

      poetsInEra.forEach((poet, index) => {
        if (index === 0) {
          nodes.push({
            id: poet.name,
            poet,
            x: centerX,
            y: centerY,
          });
          return;
        }

        let remaining = index - 1;
        let ring = 1;
        let slots = 6;
        while (remaining >= slots) {
          remaining -= slots;
          ring += 1;
          slots = ring * 6;
        }

        const angle = (remaining / slots) * Math.PI * 2 - Math.PI / 2;
        const maxAllowed = Math.max(center.r - nodeRadius(poet) - 26, ringStep);
        const ringRadius = Math.min(ring * ringStep, maxAllowed);
        nodes.push({
          id: poet.name,
          poet,
          x: centerX + Math.cos(angle) * ringRadius,
          y: centerY + Math.sin(angle) * ringRadius,
        });
      });
    });

    select(svgRef.current).selectAll('*').remove();

    const svg = select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');

    const g = svg.append('g');
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoomBehavior);

    const labelExtra = 50;
    const fitScale = Math.min(
      (width * 0.96) / (totalW + 100),
      (height * 0.92) / (totalH + labelExtra * 2)
    );
    svg.call(zoomBehavior.transform, zoomIdentity.translate(width / 2, height / 2).scale(fitScale).translate(-width / 2, -height / 2));

    // --- Era background circles ---
    const eraGroups = g.append('g')
      .selectAll('g')
      .data(sortedEras)
      .join('g')
      .attr('transform', d => `translate(${eraCenters[d].x + width / 2}, ${eraCenters[d].y + height / 2})`);

    eraGroups.append('circle')
      .attr('r', d => eraCenters[d].r)
      .attr('fill', d => ERA_FILL[d] ?? '#e8e4d9')
      .attr('fill-opacity', 0.5)
      .attr('stroke', '#b83b3b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '8,8')
      .attr('opacity', 0.5);

    eraGroups.append('text')
      .text(d => d)
      .attr('y', d => -eraCenters[d].r - 24)
      .attr('text-anchor', 'middle')
      .attr('fill', '#b83b3b')
      .attr('font-size', '44px')
      .attr('font-weight', 900)
      .attr('opacity', 0.85)
      .style('letter-spacing', '0.12em');

    // --- Boundary constraint force ---
    const containForce: Force<GraphNode, undefined> = Object.assign(
      () => {
        for (const n of nodes) {
          if (n.x == null || n.y == null) continue;
          const c = eraCenters[graphEraOf(n.poet)];
          if (!c) continue;
          const nr = nodeRadius(n.poet);
          const maxD = Math.max(c.r - nr - 6, 15);
          const cx = c.x + width / 2;
          const cy = c.y + height / 2;
          const dx = n.x - cx;
          const dy = n.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > maxD && dist > 0.001) {
            const ratio = maxD / dist;
            n.x = cx + dx * ratio;
            n.y = cy + dy * ratio;
            n.vx = (n.vx ?? 0) * 0.5;
            n.vy = (n.vy ?? 0) * 0.5;
          }
        }
      },
      { initialize() {} },
    );

    // --- Force Simulation ---
    const linkPoet = (end: string | GraphNode) => typeof end === 'string' ? poetByName[end] : end.poet;

    const simulation = forceSimulation(nodes)
      .force('link', forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance((d) => {
          const sourcePoet = linkPoet(d.source as string | GraphNode);
          const targetPoet = linkPoet(d.target as string | GraphNode);
          const sameEra = graphEraOf(sourcePoet) === graphEraOf(targetPoet);
          const labelGap = Math.min(d.label.length * 10, 48);
          const baseGap = sameEra ? 140 : 90;
          return nodeRadius(sourcePoet) + nodeRadius(targetPoet) + baseGap + labelGap;
        })
        .strength((d) => {
          const sourcePoet = linkPoet(d.source as string | GraphNode);
          const targetPoet = linkPoet(d.target as string | GraphNode);
          return graphEraOf(sourcePoet) === graphEraOf(targetPoet) ? 0.3 : 0.16;
        }))
      .force('charge', forceManyBody().strength(-360))
      .force('collide', forceCollide<GraphNode>().radius((d) => {
        const relationPadding = (relationCounts[d.poet.name] ?? 0) > 0 ? 24 : 12;
        return nodeRadius(d.poet) + relationPadding;
      }).strength(1).iterations(5))
      .force('x', forceX<GraphNode>(d => eraCenters[graphEraOf(d.poet)].x + width / 2).strength(0.14))
      .force('y', forceY<GraphNode>(d => eraCenters[graphEraOf(d.poet)].y + height / 2).strength(0.14))
      .force('contain', containForce)
      .alphaDecay(0.015);

    // --- Layer 1: Link lines (bottom) ---
    const linkLineGroup = g.append('g');
    const linkLineItems = linkLineGroup.selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', '#111111')
      .attr('stroke-opacity', 0.45)
      .attr('stroke-width', 2.2)
      .attr('fill', 'none');

    // --- Layer 2: Nodes (middle) ---
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (event.defaultPrevented) return;
        if (onNodeClick) onNodeClick(d.poet);
      })
      .call(drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as unknown as (selection: Selection<SVGGElement | BaseType, GraphNode, SVGGElement, unknown>) => void);

    node.append('circle')
      .attr('r', d => nodeRadius(d.poet))
      .attr('fill', d => {
        if (d.poet.weight === 3) return '#b83b3b';
        if (d.poet.weight === 2) return '#4a6b8c';
        return '#5c7a6b';
      })
      .attr('stroke', '#f4f1e8')
      .attr('stroke-width', 2)
      .attr('opacity', 0.92);

    node.append('text')
      .text(d => d.poet.name)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .attr('font-size', d => nodeFontSize(d.poet))
      .attr('font-weight', 'bold')
      .attr('writing-mode', 'vertical-rl')
      .style('letter-spacing', '1px');

    // --- Layer 3: Link labels (top-most, never obscured) ---
    const linkLabelGroup = g.append('g');
    const linkLabelItems = linkLabelGroup.selectAll('g')
      .data(links)
      .join('g')
      .style('pointer-events', 'none');

    linkLabelItems.append('rect')
      .attr('fill', '#fffef8')
      .attr('fill-opacity', 0.95)
      .attr('stroke', '#d4c4b7')
      .attr('stroke-width', 0.5)
      .attr('rx', 4)
      .attr('ry', 4);

    linkLabelItems.append('text')
      .text(d => d.label)
      .attr('fill', '#b83b3b')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');

    function getLinkGeometry(d: { source: GraphNode; target: GraphNode; label: string }) {
      const sx = d.source.x ?? 0;
      const sy = d.source.y ?? 0;
      const tx = d.target.x ?? 0;
      const ty = d.target.y ?? 0;
      const dx = tx - sx;
      const dy = ty - sy;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      const sourceEra = graphEraOf(d.source.poet);
      const targetEra = graphEraOf(d.target.poet);
      const sameEra = sourceEra === targetEra;

      let cx = mx;
      let cy = my;
      if (sameEra) {
        const eraCx = eraCenters[sourceEra].x + width / 2;
        const eraCy = eraCenters[sourceEra].y + height / 2;
        let ox = mx - eraCx;
        let oy = my - eraCy;
        const outwardDist = Math.hypot(ox, oy);
        if (outwardDist < 0.001) {
          ox = -dy;
          oy = dx;
        }
        const scale = Math.max(Math.hypot(ox, oy), 1);
        const lift = Math.min(d.label.length * 6 + 52, 130);
        cx = mx + (ox / scale) * lift;
        cy = my + (oy / scale) * lift;
      } else {
        const nx = -dy / dist;
        const ny = dx / dist;
        const direction = sx <= tx ? 1 : -1;
        const lift = Math.min(d.label.length * 5 + 52, 135);
        cx = mx + nx * lift * direction;
        cy = my + ny * lift * direction;
      }

      const lx = (sx + 2 * cx + tx) / 4;
      const ly = (sy + 2 * cy + ty) / 4;
      return { sx, sy, tx, ty, cx, cy, lx, ly };
    }

    type ResolvedLink = GraphLink & { source: GraphNode; target: GraphNode };

    simulation.on('tick', () => {
      linkLineItems.attr('d', (d) => {
        const { sx, sy, tx, ty, cx, cy } = getLinkGeometry(d as ResolvedLink);
        return `M${sx},${sy}Q${cx},${cy},${tx},${ty}`;
      });

      linkLabelItems.each(function(this: SVGGElement | BaseType, d) {
        const gEl = select(this as SVGGElement);
        const { lx, ly } = getLinkGeometry(d as ResolvedLink);

        const textEl = gEl.select('text').attr('x', lx).attr('y', ly).node() as SVGTextElement;
        if (textEl) {
          const bbox = textEl.getBBox();
          const pad = 4;
          gEl.select('rect')
            .attr('x', bbox.x - pad)
            .attr('y', bbox.y - pad)
            .attr('width', bbox.width + pad * 2)
            .attr('height', bbox.height + pad * 2);
        }
      });

      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        const c = eraCenters[graphEraOf(n.poet)];
        if (!c) continue;
        const nr = nodeRadius(n.poet);
        const maxD = Math.max(c.r - nr - 6, 15);
        const cx = c.x + width / 2;
        const cy = c.y + height / 2;
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxD) {
          const ratio = maxD / dist;
          n.x = cx + dx * ratio;
          n.y = cy + dy * ratio;
        }
      }

      node.attr('transform', d => `translate(${d.x},${d.y})`);
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
  }, [allPoets, onNodeClick]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#f4f1e8]/95 backdrop-blur-sm flex items-center justify-center p-8">
      <div className="bg-white w-full h-full rounded-xl shadow-2xl overflow-hidden relative border border-[#d4c4b7] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#d4c4b7] bg-[#faf9f5]">
          <div>
            <h2 className="text-2xl font-black tracking-[0.2em] text-[#b83b3b]">全景人物关系图谱</h2>
            <p className="text-sm text-gray-500 mt-1 tracking-widest">同时期人物归类，点击节点查看详情，支持拖拽缩放</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Graph Container */}
        <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#faf9f5]">
          <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>
      </div>
    </div>
  );
};
