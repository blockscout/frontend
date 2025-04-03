import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

interface Props extends React.SVGProps<SVGPathElement> {
  id?: string;
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  yScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  color?: string;
  data: Array<TimeChartItem>;
  noAnimation?: boolean;
}

const ChartArea = ({ id, xScale, yScale, color, data, noAnimation, ...props }: Props) => {
  const ref = React.useRef(null);

  const gradientColorId = `${ id || 'gradient' }-${ color }-color`;
  const gradientStopColor = useToken('colors', useColorModeValue('whiteAlpha.200', 'blackAlpha.100'));
  const defaultGradient = {
    startColor: useToken('colors', useColorModeValue('blue.100', 'blue.400')),
    stopColor: useToken('colors', useColorModeValue('rgba(190, 227, 248, 0)', 'rgba(66, 153, 225, 0)')), // blue.100 - blue.400 with 0 opacity
  };

  React.useEffect(() => {
    if (noAnimation) {
      d3.select(ref.current).attr('opacity', 1);
      return;
    }
    d3.select(ref.current).transition()
      .duration(750)
      .ease(d3.easeBackIn)
      .attr('opacity', 1);
  }, [ noAnimation ]);

  const d = React.useMemo(() => {
    const area = d3.area<TimeChartItem>()
      .defined(({ isApproximate }) => !isApproximate)
      .x(({ date }) => xScale(date))
      .y1(({ value }) => yScale(value))
      .y0(() => yScale(yScale.domain()[0]))
      .curve(d3.curveMonotoneX);
    return area(data) || undefined;
  }, [ xScale, yScale, data ]);

  return (
    <>
      <path
        ref={ ref }
        d={ d }
        fill={ color ? `url(#${ gradientColorId })` : 'url(#gradient-chart-area-default)' }
        opacity={ 0 }
        data-name={ id || 'gradient-chart-area' }
        { ...props }
      />
      { color ? (
        <defs>
          <linearGradient id={ `${ gradientColorId }` } x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={ color }/>
            <stop offset="100%" stopColor={ gradientStopColor[0] }/>
          </linearGradient>
        </defs>
      ) : (
        <defs>
          <linearGradient id="gradient-chart-area-default" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={ defaultGradient.startColor[0] }/>
            <stop offset="100%" stopColor={ defaultGradient.stopColor[0] }/>
          </linearGradient>
        </defs>
      ) }
    </>
  );
};

export default React.memo(ChartArea);
