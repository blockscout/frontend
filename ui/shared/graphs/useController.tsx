import * as d3 from 'd3';
import { useMemo } from 'react';

interface DataItem {
  date: Date;
  value: number;
}

interface Props {
  data: {
    items: Array<DataItem>;
  };
  width: number;
  height: number;
}

const useController = ({ data, width, height }: Props) => {

  const xMin = useMemo(
    () => d3.min(data.items, ({ date }) => date) || new Date(),
    [ data ],
  );

  const xMax = useMemo(
    () => d3.max(data.items, ({ date }) => date) || new Date(),
    [ data ],
  );

  const xScale = useMemo(
    () => d3.scaleTime().domain([ xMin, xMax ]).range([ 0, width ]),
    [ xMin, xMax, width ],
  );

  const yMin = useMemo(
    () => d3.min(data.items, ({ value }) => value) || 0,
    [ data ],
  );

  const yMax = useMemo(
    () => d3.max(data.items, ({ value }) => value) || 0,
    [ data ],
  );

  const yScale = useMemo(() => {
    const indention = (yMax - yMin) * 0.5;
    return d3.scaleLinear()
      .domain([ Math.max(yMin - indention, 0), yMax + indention ])
      .range([ height, 0 ]);
  }, [ height, yMin, yMax ]);

  const yScaleForAxis = useMemo(
    () => d3.scaleBand().domain([ String(yMin), String(yMax) ]).range([ height, 0 ]),
    [ height, yMin, yMax ],
  );

  const yTickFormat = (d: d3.AxisDomain) => d.toLocaleString();

  return {
    yTickFormat,
    xScale,
    yScale,
    yScaleForAxis,
  };
};

export default useController;
