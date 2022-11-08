import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

interface Props extends React.SVGProps<SVGPathElement> {
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  yScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  color: string;
  data: Array<TimeChartItem>;
  disableAnimation?: boolean;
}

const ChartArea = ({ xScale, yScale, color, data, disableAnimation, ...props }: Props) => {
  const ref = React.useRef(null);
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
      .y0(() => yScale(yScale.domain()[0]));
    return area(data) || undefined;
  }, [ xScale, yScale, data ]);

  return (
    <>
      <path ref={ ref } d={ d } fill={ `url(#gradient-${ color })` } opacity={ 0 } { ...props }/>
      <defs>
        <linearGradient id={ `gradient-${ color }` } x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={ color } stopOpacity={ 1 }/>
          <stop offset="100%" stopColor={ color } stopOpacity={ 0.15 }/>
        </linearGradient>
      </defs>
    </>
  );
};

export default React.memo(ChartArea);
