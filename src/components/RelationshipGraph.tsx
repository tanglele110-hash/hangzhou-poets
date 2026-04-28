import React, { useEffect, useRef } from 'react';
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
}

interface RelationshipGraphProps {
  centerPoet: Poet;
  allPoets: Poet[];
  onClose: () => void;
  onNodeClick?: (poet: Poet) => void;
  onOpenGlobalGraph?: () => void;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ centerPoet, allPoets, onClose, onNodeClick, onOpenGlobalGraph }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // Generate Data
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    
    const centerNode: GraphNode = { id: centerPoet.name, poet: centerPoet, isCenter: true };
    nodes.push(centerNode);
    
    const connectedPoets: Poet[] = [];
    const addedNodeIds = new Set<string>();
    addedNodeIds.add(centerPoet.name);

    // Find direct connections to centerPoet
    KNOWN_RELATIONSHIPS.forEach(rel => {
      if (rel.source === centerPoet.name || rel.target === centerPoet.name) {
        const otherName = rel.source === centerPoet.name ? rel.target : rel.source;
        const otherPoet = allPoets.find(p => p.name === otherName);
        if (otherPoet && !addedNodeIds.has(otherName)) {
          connectedPoets.push(otherPoet);
          nodes.push({ id: otherName, poet: otherPoet, isCenter: false });
          addedNodeIds.add(otherName);
          links.push({ source: centerPoet.name, target: otherName, strength: 1, label: rel.label });
        }
      }
    });

    // Find connections between the connected poets
    for (let i = 0; i < connectedPoets.length; i++) {
      for (let j = i + 1; j < connectedPoets.length; j++) {
        const p1 = connectedPoets[i];
        const p2 = connectedPoets[j];
        
        const rel = KNOWN_RELATIONSHIPS.find(r => 
          (r.source === p1.name && r.target === p2.name) || 
          (r.source === p2.name && r.target === p1.name)
        );

        if (rel) {
          links.push({ source: p1.name, target: p2.name, strength: 0.5, label: rel.label });
        }
      }
    }

    // Clear previous SVG content
    select(svgRef.current).selectAll("*").remove();

    const svg = select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Add zoom capabilities
    const g = svg.append("g");
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoomBehavior);

    const simulation = forceSimulation(nodes)
      .force("link", forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(150).strength((d) => d.strength * 0.3))
      .force("charge", forceManyBody().strength(-800))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide().radius(60));

    // Draw links
    const linkGroup = g.append("g")
      .selectAll("g")
      .data(links)
      .join("g");

    const linkLine = linkGroup.append("line")
      .attr("stroke", "#d4c4b7")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const linkText = linkGroup.append("text")
      .text(d => d.label)
      .attr("fill", "#888")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("text-shadow", "2px 2px 0 #f4f1e8, -2px -2px 0 #f4f1e8, 2px -2px 0 #f4f1e8, -2px 2px 0 #f4f1e8");

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (event.defaultPrevented) return; // dragged
        if (onNodeClick) {
          onNodeClick(d.poet);
        }
      })
      .call(drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as unknown as (selection: Selection<SVGGElement | BaseType, GraphNode, SVGGElement, unknown>) => void);

    // Node circles
    node.append("circle")
      .attr("r", d => d.isCenter ? 35 : 25)
      .attr("fill", d => {
        if (d.isCenter) return "#b83b3b";
        if (d.poet.weight === 3) return "#b83b3b";
        if (d.poet.weight === 2) return "#4a6b8c";
        return "#5c7a6b";
      })
      .attr("stroke", "#f4f1e8")
      .attr("stroke-width", 3)
      .attr("opacity", 0.9);

    // Node text (vertical)
    node.append("text")
      .text(d => d.poet.name)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#fff")
      .attr("font-size", d => d.isCenter ? "16px" : "12px")
      .attr("font-weight", "bold")
      .attr("writing-mode", "vertical-rl")
      .style("letter-spacing", "2px");

    // Era label
    node.append("text")
      .text(d => d.poet.era)
      .attr("y", d => d.isCenter ? 50 : 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "10px")
      .attr("font-weight", "bold");

    simulation.on("tick", () => {
      linkLine
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      linkText
        .attr("x", d => ((d.source as any).x + (d.target as any).x) / 2)
        .attr("y", d => ((d.source as any).y + (d.target as any).y) / 2);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
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
  }, [centerPoet, allPoets]);

  // Check if there are any connections
  const hasConnections = KNOWN_RELATIONSHIPS.some(
    rel => rel.source === centerPoet.name || rel.target === centerPoet.name
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-[#f4f1e8] border border-[#d4c4b7] shadow-2xl pointer-events-auto w-[90vw] h-[85vh] rounded-sm flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-end gap-4">
          <button 
            onClick={onClose} 
            className="self-start text-gray-500 hover:text-[#b83b3b] transition-colors bg-white/80 p-2 rounded-full shadow-sm"
          >
            <X size={24} />
          </button>
          <div className="bg-white/80 px-4 py-2 rounded-md shadow-sm border border-[#d4c4b7]/50">
            <h3 className="text-lg font-bold text-[#b83b3b] m-0">{centerPoet.name} 的人物关系图谱</h3>
            <p className="text-xs text-gray-500 m-0 mt-1">基于历史记载的真实交往与关系</p>
          </div>
          {onOpenGlobalGraph && (
            <button
              onClick={onOpenGlobalGraph}
              className="self-end flex items-center gap-1.5 rounded-sm border border-[#b83b3b]/30 bg-white/85 px-3 py-2 text-xs font-bold tracking-widest text-[#b83b3b] shadow-sm transition-colors hover:bg-[#b83b3b]/10"
            >
              <Network size={14} />
              <span>全景关系图谱</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 w-full h-full relative" ref={containerRef}>
          {!hasConnections && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold tracking-widest text-lg">
              暂无该诗人的明确人物关系记录
            </div>
          )}
          <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        </div>
      </div>
    </div>
  );
};
