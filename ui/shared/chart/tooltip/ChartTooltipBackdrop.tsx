import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import { calculateContainerHeight } from './utils';

const ChartTooltipBackdrop = () => {
  const bgColor = useToken('colors', 'blackAlpha.900');

  return (
    <rect
      className="ChartTooltip__backdrop"
      rx={ 12 }
      ry={ 12 }
      fill={ bgColor }
    />
  );
};

export default React.memo(ChartTooltipBackdrop);

interface UseRenderBackdropParams {
  seriesNum: number;
}

export function useRenderBackdrop(ref: React.RefObject<SVGGElement>, { seriesNum }: UseRenderBackdropParams) {
  return React.useCallback((width: number, isIncompleteData: boolean) => {
    d3.select(ref.current)
      .select('.ChartTooltip__backdrop')
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('width', width)
      .attr('height', calculateContainerHeight(seriesNum, isIncompleteData));
  }, [ ref, seriesNum ]);
}
