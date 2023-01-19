import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

interface Props extends Omit<React.SVGProps<SVGGElement>, 'scale'> {
  type: 'vertical' | 'horizontal';
  scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  disableAnimation?: boolean;
  size: number;
  ticks: number;
}

const ChartGridLine = ({ type, scale, ticks, size, disableAnimation, ...props }: Props) => {
  const ref = React.useRef<SVGGElement>(null);

  const strokeColor = useToken('colors', 'divider');

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
    gridGroup.selectAll('line').attr('stroke', strokeColor);
  }, [ scale, ticks, size, disableAnimation, type, strokeColor ]);

  return <g ref={ ref } { ...props }/>;
};

export default React.memo(ChartGridLine);
