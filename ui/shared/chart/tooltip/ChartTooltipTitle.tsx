import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';

import { STATS_RESOLUTIONS } from 'ui/stats/constants';

import ChartTooltipRow from './ChartTooltipRow';

const ChartTooltipTitle = ({ resolution = Resolution.DAY }: { resolution?: Resolution }) => {
  const titleColor = useToken('colors', 'yellow.300');
  const resolutionTitle = STATS_RESOLUTIONS.find(r => r.id === resolution)?.title || 'day';

  return (
    <ChartTooltipRow lineNum={ 0 }>
      <text
        className="ChartTooltip__title"
        transform="translate(0,0)"
        fill={ titleColor[0] }
        opacity={ 0 }
        dominantBaseline="hanging"
      >
        { `Incomplete ${ resolutionTitle.toLowerCase() }` }
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
