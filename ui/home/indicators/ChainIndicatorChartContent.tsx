import { useToken } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import ChartArea from 'ui/shared/chart/ChartArea';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

interface Props {
  data: TimeChartData;
  caption?: string;
}

const CHART_MARGIN = { bottom: 5, left: 10, right: 10, top: 5 };

const ChainIndicatorChartContent = ({ data }: Props) => {
  const overlayRef = React.useRef<SVGRectElement>(null);
  const lineColor = useToken('colors', 'blue.500');

  const axesConfig = React.useMemo(() => {
    return {
      x: { ticks: 4 },
      y: { ticks: 3, nice: true, noLabel: true },
    };
  }, [ ]);

  const { rect, ref, axes, innerWidth, innerHeight, chartMargin } = useTimeChartController({
    data,
    margin: CHART_MARGIN,
    axesConfig,
  });

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer">
      <g transform={ `translate(${ chartMargin.left || 0 },${ chartMargin.top || 0 })` } opacity={ rect ? 1 : 0 }>
        <ChartArea
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
        />
        <ChartLine
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          stroke={ lineColor[0] }
          animation="left"
          strokeWidth={ 3 }
        />
        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ data }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChainIndicatorChartContent);
