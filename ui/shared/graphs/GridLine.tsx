import * as d3 from 'd3';
import React from 'react';

interface Props {
  type: 'vertical' | 'horizontal';
  scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  disableAnimation?: boolean;
  size: number;
  transform?: string;
  ticks: number;
}

const GridLine = ({ type, scale, ticks, size, transform, disableAnimation, ...props }: Props) => {
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const axisGenerator = type === 'vertical' ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = d3.select(ref.current);
    if (disableAnimation) {
      gridGroup.call(axis);
    } else {
      gridGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    gridGroup.select('.domain').remove();
    gridGroup.selectAll('text').remove();
    gridGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.1)');
  }, [ scale, ticks, size, disableAnimation, type ]);

  return <g ref={ ref } transform={ transform } { ...props }/>;
};

export default React.memo(GridLine);
