import { useToken } from '@chakra-ui/react';
import React from 'react';

import ethTxsData from 'data/charts_eth_txs.json';
import useClientRect from 'lib/hooks/useClientRect';
import ChartLine from 'ui/shared/chart/ChartLine';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';
import { BlueLineGradient } from 'ui/shared/chart/utils/gradients';

const CHART_MARGIN = { bottom: 0, left: 0, right: 0, top: 0 };
const DATA = ethTxsData.slice(-30).map((d) => ({ ...d, date: new Date(d.date) }));

const SplineChartExample = () => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const { innerWidth, innerHeight } = calculateInnerSize(rect, CHART_MARGIN);

  const color = useToken('colors', 'blue.500');
  const { xScale, yScale } = useTimeChartController({
    data: [ { items: DATA, name: 'spline', color } ],
    width: innerWidth,
    height: innerHeight,
  });

  return (
    <svg width="100%" height="100%" ref={ ref }>
      <defs>
        <BlueLineGradient.defs/>
      </defs>
      <ChartLine
        data={ DATA }
        xScale={ xScale }
        yScale={ yScale }
        stroke={ `url(#${ BlueLineGradient.id })` }
        animation="left"
        strokeWidth={ 3 }
      />
    </svg>
  );
};

export default SplineChartExample;
