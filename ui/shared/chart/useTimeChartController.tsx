import * as d3 from 'd3';
import { useMemo } from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

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

  const yMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ value }) => value)) || 0,
    [ data ],
  );

  const yMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ value }) => value)) || 0,
    [ data ],
  );

  const yScale = useMemo(() => {
    const indention = (yMax - yMin) * 0.3;
    return d3.scaleLinear()
      .domain([ yMin >= 0 && yMin - indention <= 0 ? 0 : yMin - indention, yMax + indention ])
      .range([ height, 0 ]);
  }, [ height, yMin, yMax ]);

  const yScaleForAxis = useMemo(
    () => d3.scaleBand().domain([ String(yMin), String(yMax) ]).range([ height, 0 ]),
    [ height, yMin, yMax ],
  );

  const xTickFormat = (d: d3.AxisDomain) => d.toLocaleString();
  const yTickFormat = (d: d3.AxisDomain) => d.toLocaleString();

  return {
    xTickFormat,
    yTickFormat,
    xScale,
    yScale,
    yScaleForAxis,
  };
}
