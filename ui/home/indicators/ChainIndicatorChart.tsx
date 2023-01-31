import { useToken } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import useClientRect from 'lib/hooks/useClientRect';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';

interface Props {
  data: TimeChartData;
  caption?: string;
}

const CHART_MARGIN = { bottom: 5, left: 10, right: 10, top: 0 };

const ChainIndicatorChart = ({ data }: Props) => {
  const overlayRef = React.useRef<SVGRectElement>(null);
  const lineColor = useToken('colors', 'blue.500');

  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const { innerWidth, innerHeight } = calculateInnerSize(rect, CHART_MARGIN);
  const { xScale, yScale } = useTimeChartController({
    data,
    width: innerWidth,
    height: innerHeight,
  });

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer">
      <g transform={ `translate(${ CHART_MARGIN?.left || 0 },${ CHART_MARGIN?.top || 0 })` } opacity={ rect ? 1 : 0 }>
        <ChartArea
          data={ data[0].items }
          xScale={ xScale }
          yScale={ yScale }
        />
        <ChartLine
          data={ data[0].items }
          xScale={ xScale }
          yScale={ yScale }
          stroke={ lineColor }
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
      </g>
    </svg>
  );
};

export default React.memo(ChainIndicatorChart);
