import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import ChartTooltipRow from './ChartTooltipRow';

const ChartTooltipTitle = () => {
  const titleColor = useToken('colors', 'yellow.300');

  return (
    <ChartTooltipRow lineNum={ 0 }>
      <text
        className="ChartTooltip__title"
        transform="translate(0,0)"
        fill={ titleColor }
        opacity={ 0 }
        dominantBaseline="hanging"
      >
        Incomplete day
      </text>
    </ChartTooltipRow>
  );
};

export default React.memo(ChartTooltipTitle);

export function useRenderTitle(ref: React.RefObject<SVGGElement>) {
  return React.useCallback((isVisible: boolean) => {
    d3.select(ref.current)
      .select('.ChartTooltip__title')
      .attr('opacity', isVisible ? 1 : 0);
  }, [ ref ]);
}
