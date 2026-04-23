import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

const CLASS_NAME = 'LineChartTooltip__line';

const LineChartTooltipLine = () => {
  const lineColor = useToken('colors', 'gray.400');
  return <line className={ CLASS_NAME } stroke={ lineColor[0] } strokeDasharray="3"/>;
};

export default React.memo(LineChartTooltipLine);

export function useRenderLine(ref: React.RefObject<SVGGElement | null>, chartHeight: number | undefined) {
  return React.useCallback((x: number) => {
    d3.select(ref.current)
      .select(`.${ CLASS_NAME }`)
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', chartHeight || 0);
  }, [ ref, chartHeight ]);
}
