import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Zap } from 'lucide-react';

const DATA = {
  nodes: [
    { id: 'Soul', group: 1 },
    { id: 'Light', group: 1 },
    { id: 'Muraqaba', group: 2 },
    { id: 'Consciousness', group: 2 },
    { id: 'Divine', group: 3 },
    { id: 'Qalandar', group: 3 },
    { id: 'Healing', group: 4 },
    { id: 'Breath', group: 4 },
  ],
  links: [
    { source: 'Soul', target: 'Light' },
    { source: 'Soul', target: 'Consciousness' },
    { source: 'Muraqaba', target: 'Soul' },
    { source: 'Muraqaba', target: 'Breath' },
    { source: 'Light', target: 'Divine' },
    { source: 'Divine', target: 'Qalandar' },
    { source: 'Healing', target: 'Breath' },
    { source: 'Healing', target: 'Light' },
  ]
};

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(DATA.nodes as any)
      .force('link', d3.forceLink(DATA.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#00000010')
      .attr('stroke-width', 1.5)
      .selectAll('line')
      .data(DATA.links)
      .join('line');

    const node = svg.append('g')
      .selectAll('g')
      .data(DATA.nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => {
        const colors = ['#2563EB', '#3B82F6', '#D4AF37', '#1E40AF'];
        return colors[d.group - 1];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    node.append('text')
      .text(d => d.id)
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#111827')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <div className="bg-white border border-border-light p-6 space-y-4 rounded-2xl shadow-sm">
      <h3 className="font-bold flex items-center gap-2 text-text-main">
        <Zap size={18} className="text-primary" />
        Inter-textual Knowledge Graph
      </h3>
      <div className="bg-gray-50 rounded-xl overflow-hidden border border-border-light">
        <svg ref={svgRef} className="w-full h-auto" />
      </div>
      <p className="text-[10px] text-text-muted uppercase tracking-widest text-center">
        Mapping connections across the Azeemia Library
      </p>
    </div>
  );
}
