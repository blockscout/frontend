import { useToken } from '@chakra-ui/react';
import React from 'react';

import type { ChainIndicatorChartData } from './types';

import ChartArea from 'ui/shared/chart/ChartArea';
import ChartLine from 'ui/shared/chart/ChartLine';
import useChartSize from 'ui/shared/chart/useChartSize';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import { BlueLineGradient } from 'ui/shared/chart/utils/gradients';

interface Props {
  data: ChainIndicatorChartData;
}

const ChainIndicatorChart = ({ data }: Props) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const { width, height, innerWidth, innerHeight } = useChartSize(ref.current);
  const color = useToken('colors', 'blue.300');
  const { xScale, yScale } = useTimeChartController({
    data: [ { items: data, name: 'spline' } ],
    width: innerWidth,
    height: innerHeight,
  });

  return (
    <svg width={ width || '100%' } height={ height || '100%' } ref={ ref }>
      <defs>
        <BlueLineGradient.defs/>
      </defs>
      <ChartArea
        data={ data }
        color={ color }
        xScale={ xScale }
        yScale={ yScale }
      />
      <ChartLine
        data={ data }
        xScale={ xScale }
        yScale={ yScale }
        stroke={ `url(#${ BlueLineGradient.id })` }
        animation="left"
        strokeWidth={ 3 }
      />
    </svg>
  );
};

export default React.memo(ChainIndicatorChart);
