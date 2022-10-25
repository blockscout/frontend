import { useToken } from '@chakra-ui/react';
import React from 'react';

import json from 'data/charts_eth_txs.json';
import Area from 'ui/shared/graphs/Area';
import Axis from 'ui/shared/graphs/Axis';
import GridLine from 'ui/shared/graphs/GridLine';
import Line from 'ui/shared/graphs/Line';
import useTimeGraphController from 'ui/shared/graphs/useTimeGraphController';

const dimensions = {
  width: 600,
  height: 300,
  margin: { top: 0, right: 0, bottom: 20, left: 65 },
};
const data = {
  items: json.map((d) => ({ ...d, date: new Date(d.date) })),
};

const EthereumDailyTxsChart = () => {
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const controller = useTimeGraphController({ data, width, height });
  const { yTickFormat, xScale, yScale } = controller;

  const lineColor = useToken('colors', 'blue.500');

  return (
    <svg width={ svgWidth } height={ svgHeight }>
      <g transform={ `translate(${ margin.left },${ margin.top })` }>
        { /* BASE GRID LINE */ }
        <GridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 1 }
          size={ width }
          disableAnimation
        />

        { /* GIRD LINES */ }
        <GridLine
          type="vertical"
          scale={ xScale }
          ticks={ 5 }
          size={ height }
          transform={ `translate(0, ${ height })` }
        />
        <GridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 5 }
          size={ width }
        />

        { /* GRAPH */ }
        <Line
          data={ data.items }
          xScale={ xScale }
          yScale={ yScale }
          stroke={ lineColor }
          animation="left"
        />
        <Area
          data={ data.items }
          color={ lineColor }
          xScale={ xScale }
          yScale={ yScale }
        />

        { /* AXISES */ }
        <Axis
          type="left"
          scale={ yScale }
          ticks={ 5 }
          tickFormat={ yTickFormat }
        />
        <Axis
          type="bottom"
          scale={ xScale }
          transform={ `translate(0, ${ height })` }
          ticks={ 5 }
        />
      </g>
    </svg>
  );
};

export default EthereumDailyTxsChart;
