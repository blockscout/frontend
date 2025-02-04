import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

interface Props extends Omit<React.SVGProps<SVGGElement>, 'scale'> {
  data: Array<{ value: number; label: string }>;
  width: number;
  height: number;
  disableAnimation?: boolean;
}

const PieChart = ({ data, width, height, disableAnimation, ...props }: Props) => {
  const ref = React.useRef<SVGGElement>(null);
  const strokeColor = useToken('colors', 'divider');

  // Create a tooltip div
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie<{ value: number; label: string }>().value(d => d.value);
    const arc = d3.arc<d3.PieArcDatum<{ value: number; label: string }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const pieGroup = d3.select(ref.current)
      .attr('transform', `translate(${ width / 2 }, ${ height / 2 })`);

    const arcs = pie(data);

    // Create pie slices
    pieGroup.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()))
      .attr('stroke', strokeColor)
      .on('mouseover', (event, d) => {
        // Show tooltip on hover
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.innerHTML = `${ d.data.label }: ${ d.data.value }`;
          tooltipRef.current.style.left = `${ event.pageX + 10 }px`;
          tooltipRef.current.style.top = `${ event.pageY - 30 }px`;
        }
      })
      .on('mouseout', () => {
        // Hide tooltip when not hovering
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      })
      .transition()
      .duration(disableAnimation ? 0 : 750)
      .ease(d3.easeLinear);
  }, [ data, width, height, disableAnimation, strokeColor ]);

  return (
    <>
      <g ref={ ref } { ...props }/>
      { /* Tooltip element */ }
      <div
        ref={ tooltipRef }
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px',
          display: 'none',
          pointerEvents: 'none', // Prevent mouse events on the tooltip
          zIndex: 100,
        }}
      />
    </>
  );
};

export default React.memo(PieChart);
