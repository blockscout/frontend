import { useColorModeValue, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

interface Props extends React.SVGProps<SVGPathElement> {
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  yScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  color?: string;
  data: Array<TimeChartItem>;
  disableAnimation?: boolean;
}

const ChartArea = ({ xScale, yScale, color, data, disableAnimation, ...props }: Props) => {
  const ref = React.useRef(null);
  const gradientStopColor = useToken('colors', useColorModeValue('whiteAlpha.200', 'blackAlpha.100'));

  React.useEffect(() => {
    if (disableAnimation) {
      d3.select(ref.current).attr('opacity', 1);
      return;
    }
    d3.select(ref.current).transition()
      .duration(750)
      .ease(d3.easeBackIn)
      .attr('opacity', 1);
  }, [ disableAnimation ]);

  const d = React.useMemo(() => {
    const area = d3.area<TimeChartItem>()
      .x(({ date }) => xScale(date))
      .y1(({ value }) => yScale(value))
      .y0(() => yScale(yScale.domain()[0]))
      .curve(d3.curveNatural);
    return area(data) || undefined;
  }, [ xScale, yScale, data ]);

  return (
    <>
      <path ref={ ref } d={ d } fill={ color ? `url(#gradient-${ color })` : 'none' } opacity={ 0 } { ...props }/>
      { color && (
        <defs>
          <linearGradient id={ `gradient-${ color }` } x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="2%" stopColor={ color }/>
            <stop offset="78%" stopColor={ gradientStopColor }/>
          </linearGradient>
        </defs>
      ) }
    </>
  );
};

export default React.memo(ChartArea);
