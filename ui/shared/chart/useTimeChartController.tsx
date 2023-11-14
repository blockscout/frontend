import React from 'react';

import type { ChartMargin, TimeChartData } from 'ui/shared/chart/types';

import useClientRect from 'lib/hooks/useClientRect';

import calculateInnerSize from './utils/calculateInnerSize';
import { getAxisParams, DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS } from './utils/timeChartAxis';

interface Props {
  data: TimeChartData;
  margin?: ChartMargin;
  ticks?: { x?: number; y?: number };
}

export default function useTimeChartController({ data, margin, ticks }: Props) {

  const [ rect, ref ] = useClientRect<SVGSVGElement>();

  // we need to recalculate the axis scale whenever the rect width changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const axisParams = React.useMemo(() => getAxisParams(data, ticks), [ data, ticks, rect?.width ]);

  const chartMargin = React.useMemo(() => {
    const exceedingDigits = (axisParams.y.labelFormatParams.maximumSignificantDigits ?? DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS) -
       DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS;
    const PIXELS_PER_DIGIT = 7;
    const leftShift = PIXELS_PER_DIGIT * exceedingDigits;

    return {
      ...margin,
      left: (margin?.left ?? 0) + leftShift,
    };
  }, [ axisParams.y.labelFormatParams.maximumSignificantDigits, margin ]);

  const { innerWidth, innerHeight } = calculateInnerSize(rect, chartMargin);

  const xScale = React.useMemo(() => {
    return axisParams.x.scale.range([ 0, innerWidth ]);
  }, [ axisParams.x.scale, innerWidth ]);

  const yScale = React.useMemo(() => {
    return axisParams.y.scale.range([ innerHeight, 0 ]);
  }, [ axisParams.y.scale, innerHeight ]);

  return React.useMemo(() => {
    return {
      rect,
      ref,
      chartMargin,
      innerWidth,
      innerHeight,
      axis: {
        x: {
          tickFormatter: axisParams.x.tickFormatter,
          scale: xScale,
        },
        y: {
          tickFormatter: axisParams.y.tickFormatter,
          scale: yScale,
        },
      },
    };
  }, [ axisParams.x.tickFormatter, axisParams.y.tickFormatter, chartMargin, innerHeight, innerWidth, rect, ref, xScale, yScale ]);
}
