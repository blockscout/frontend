import * as d3 from 'd3';
import { useMemo } from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import { WEEK, MONTH, YEAR } from 'lib/consts';

import { getAxisParamsY } from './utils/axis';

interface Props {
  data: TimeChartData;
  width: number;
  height: number;
}

export default function useTimeChartController({ data, width, height }: Props) {

  const xMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ date }) => date)) || new Date(),
    [ data ],
  );

  const xMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ date }) => date)) || new Date(),
    [ data ],
  );

  const xScale = useMemo(
    () => d3.scaleTime().domain([ xMin, xMax ]).range([ 0, width ]),
    [ xMin, xMax, width ],
  );

  const { min: yMin, max: yMax, formatParams: yFormatParams } = getAxisParamsY(data);

  const yScale = useMemo(() => {
    const indention = (yMax - yMin) * 0;

    const s = d3.scaleLinear()
      .domain([ yMin >= 0 && yMin - indention <= 0 ? 0 : yMin - indention, yMax + indention ])
      .nice(3)
      .range([ height, 0 ]);

    // console.log('__>__ ticks', s.ticks(3));
    return s;
  }, [ height, yMin, yMax ]);

  const xTickFormat = (axis: d3.Axis<d3.NumberValue>) => (d: d3.AxisDomain) => {
    let format: (date: Date) => string;
    const scale = axis.scale();
    const extent = scale.domain();

    const span = Number(extent[1]) - Number(extent[0]);

    if (span > YEAR) {
      format = d3.timeFormat('%Y');
    } else if (span > 2 * MONTH) {
      format = d3.timeFormat('%b');
    } else if (span > WEEK) {
      format = d3.timeFormat('%b %d');
    } else {
      format = d3.timeFormat('%a %d');
    }

    return format(d as Date);
  };

  const yTickFormat = () => (d: d3.AxisDomain) => {
    const num = Number(d);
    return num.toLocaleString(undefined, yFormatParams);
  };

  return {
    xTickFormat,
    yTickFormat,
    xScale,
    yScale,
    yFormatParams,
  };
}
