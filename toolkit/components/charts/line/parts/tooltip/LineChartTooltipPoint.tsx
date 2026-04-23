import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { LineChartData, LineChartItem } from '../../types';

import { useColorModeValue } from '../../../../../chakra/color-mode';
import { POINT_SIZE } from './utils';

const CLASS_NAME = 'LineChartTooltip__point';

const LineChartTooltipPoint = () => {
  const bgColor = useToken('colors', useColorModeValue('black', 'white'));
  const borderColor = useToken('colors', useColorModeValue('white', 'black'));

  return (
    <circle
      className={ CLASS_NAME }
      r={ POINT_SIZE / 2 }
      opacity={ 1 }
      fill={ bgColor[0] }
      stroke={ borderColor[0] }
      strokeWidth={ 4 }
    />
  );
};

export default React.memo(LineChartTooltipPoint);

interface UseRenderPointsParams {
  data: LineChartData;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export interface CurrentPoint {
  datumIndex: number;
  item: LineChartItem;
}

interface RenderPointsReturnType {
  x: number;
  y: number;
  currentPoints: Array<CurrentPoint>;
}

export function useRenderPoints(ref: React.RefObject<SVGGElement | null>, params: UseRenderPointsParams) {
  return React.useCallback((x: number): RenderPointsReturnType => {
    const xDate = params.xScale.invert(x);
    const bisectDate = d3.bisector<LineChartItem, unknown>((d) => d.date).left;
    let baseXPos = 0;
    let baseYPos = 0;
    const currentPoints: Array<CurrentPoint> = [];

    d3.select(ref.current)
      .selectAll(`.${ CLASS_NAME }`)
      .attr('transform', (_, elementIndex) => {
        const datum = params.data[elementIndex];
        const index = bisectDate(datum.items, xDate, 1);
        const d0 = datum.items[index - 1] as LineChartItem | undefined;
        const d1 = datum.items[index] as LineChartItem | undefined;
        const d = (() => {
          if (!d0) {
            return d1;
          }
          if (!d1) {
            return d0;
          }
          return xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;
        })();

        if (d?.date === undefined && d?.value === undefined) {
          // move point out of container
          return 'translate(-100,-100)';
        }

        const xPos = params.xScale(d.date);
        const yPos = params.yScale(d.value);

        if (elementIndex === 0) {
          baseXPos = xPos;
          baseYPos = yPos;
        }

        currentPoints.push({ item: d, datumIndex: elementIndex });

        return `translate(${ xPos }, ${ yPos })`;
      });

    return {
      x: baseXPos,
      y: baseYPos,
      currentPoints,
    };
  }, [ ref, params ]);
}
