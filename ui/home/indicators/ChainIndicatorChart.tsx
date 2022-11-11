import React from 'react';

import type { ChainIndicatorChartData } from './types';

import ChartArea from 'ui/shared/chart/ChartArea';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useChartSize from 'ui/shared/chart/useChartSize';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import { BlueLineGradient } from 'ui/shared/chart/utils/gradients';

interface Props {
  data: ChainIndicatorChartData;
  caption?: string;
}

const COLOR = '#439AE2';

const ChainIndicatorChart = ({ data }: Props) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const overlayRef = React.useRef<SVGRectElement>(null);

  const { width, height, innerWidth, innerHeight } = useChartSize(ref.current);
  const { xScale, yScale } = useTimeChartController({
    data,
    width: innerWidth,
    height: innerHeight,
  });

  return (
    <svg width={ width || '100%' } height={ height || '100%' } ref={ ref } cursor="pointer">
      <defs>
        <BlueLineGradient.defs/>
      </defs>
      <ChartArea
        data={ data[0].items }
        color={ COLOR }
        xScale={ xScale }
        yScale={ yScale }
      />
      <ChartLine
        data={ data[0].items }
        xScale={ xScale }
        yScale={ yScale }
        stroke={ `url(#${ BlueLineGradient.id })` }
        animation="left"
        strokeWidth={ 3 }
      />
      <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
        <ChartTooltip
          anchorEl={ overlayRef.current }
          width={ innerWidth }
          height={ innerHeight }
          xScale={ xScale }
          yScale={ yScale }
          data={ data }
        />
      </ChartOverlay>
    </svg>
  );
};

export default React.memo(ChainIndicatorChart);
