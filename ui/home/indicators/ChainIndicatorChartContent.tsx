import React from 'react';

import type { TimeChartData } from 'toolkit/components/charts/types';

import ChartArea from 'toolkit/components/charts/parts/ChartArea';
import ChartLine from 'toolkit/components/charts/parts/ChartLine';
import ChartOverlay from 'toolkit/components/charts/parts/ChartOverlay';
import ChartTooltip from 'toolkit/components/charts/parts/ChartTooltip';
import { useDefaultGradient, useDefaultLineColor } from 'toolkit/components/charts/utils/styles';
import useTimeChartController from 'toolkit/components/charts/utils/useTimeChartController';

interface Props {
  data: TimeChartData;
  caption?: string;
}

const CHART_MARGIN = { bottom: 5, left: 10, right: 10, top: 5 };

const ChainIndicatorChartContent = ({ data }: Props) => {
  const overlayRef = React.useRef<SVGRectElement>(null);
  const lineColor = useDefaultLineColor();
  const gradient = useDefaultGradient();

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
          id={ data[0].name }
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          gradient={ gradient }
        />
        <ChartLine
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          stroke={ lineColor }
          strokeWidth={ 3 }
          animation="left"
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
