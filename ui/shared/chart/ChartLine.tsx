import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

interface Props extends React.SVGProps<SVGPathElement> {
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  yScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  data: Array<TimeChartItem>;
  animation: 'left' | 'fadeIn' | 'none';
}

const ChartLine = ({ xScale, yScale, data, animation, ...props }: Props) => {
  const ref = React.useRef<SVGPathElement>(null);

  // Define different types of animation that we can use
  const animateLeft = React.useCallback(() => {
    const totalLength = ref.current?.getTotalLength() || 0;
    d3.select(ref.current)
      .attr('opacity', 1)
      .attr('stroke-dasharray', `${ totalLength },${ totalLength }`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, []);

  const animateFadeIn = React.useCallback(() => {
    d3.select(ref.current)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  }, []);

  const noneAnimation = React.useCallback(() => {
    d3.select(ref.current).attr('opacity', 1);
  }, []);

  React.useEffect(() => {
    const ANIMATIONS = {
      left: animateLeft,
      fadeIn: animateFadeIn,
      none: noneAnimation,
    };
    const animationFn = ANIMATIONS[animation];
    window.setTimeout(animationFn, 100);
  }, [ animateLeft, animateFadeIn, noneAnimation, animation ]);

  // Recalculate line length if scale has changed
  React.useEffect(() => {
    if (animation === 'left') {
      const totalLength = ref.current?.getTotalLength();
      d3.select(ref.current).attr(
        'stroke-dasharray',
        `${ totalLength },${ totalLength }`,
      );
    }
  }, [ xScale, yScale, animation ]);

  const line = d3.line<TimeChartItem>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  return (
    <path
      ref={ ref }
      d={ line(data) || undefined }
      strokeWidth={ 1 }
      strokeLinecap="round"
      fill="none"
      opacity={ 0 }
      { ...props }
    />
  );
};

export default React.memo(ChartLine);
