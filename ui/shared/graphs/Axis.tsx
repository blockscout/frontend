import { useColorModeValue, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

interface Props extends Omit<React.SVGProps<SVGGElement>, 'scale'> {
  type: 'left' | 'bottom';
  scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  disableAnimation?: boolean;
  ticks: number;
  tickFormat?: (domainValue: d3.AxisDomain, index: number) => string;
}

const Axis = ({ type, scale, ticks, tickFormat, disableAnimation, ...props }: Props) => {
  const ref = React.useRef<SVGGElement>(null);

  const textColorToken = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const textColor = useToken('colors', textColorToken);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const axisGenerator = type === 'left' ? d3.axisLeft : d3.axisBottom;
    const axis = tickFormat ?
      axisGenerator(scale).ticks(ticks).tickFormat(tickFormat) :
      axisGenerator(scale).ticks(ticks);
    const axisGroup = d3.select(ref.current);
    if (disableAnimation) {
      axisGroup.call(axis);
    } else {
      axisGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    axisGroup.select('.domain').remove();
    axisGroup.selectAll('line').remove();
    axisGroup.selectAll('text')
      .attr('opacity', 1)
      .attr('color', textColor)
      .attr('font-size', '0.75rem');
  }, [ scale, ticks, tickFormat, disableAnimation, type, textColor ]);

  return <g ref={ ref } { ...props }/>;
};

export default React.memo(Axis);
