import React from 'react';

import json from 'data/charts_eth_txs.json';
import Area from 'ui/shared/graphs/Area';
import Axis from 'ui/shared/graphs/Axis';
import GridLine from 'ui/shared/graphs/GridLine';
import Line from 'ui/shared/graphs/Line';
import useController from 'ui/shared/graphs/useController';

const dimensions = {
  width: 600,
  height: 300,
  margin: { top: 30, right: 30, bottom: 30, left: 60 },
};
const data = {
  name: 'VCIT',
  color: '#5e4fa2',
  items: json.map((d) => ({ ...d, date: new Date(d.date) })),
};

const EthereumDailyTxsChart = () => {
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const controller = useController({ data, width, height });
  const { yTickFormat, xScale, yScale } = controller;

  return (
    <svg width={ svgWidth } height={ svgHeight }>
      <g transform={ `translate(${ margin.left },${ margin.top })` }>
        { /* base grid line */ }
        <GridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 1 }
          size={ width }
          disableAnimation
        />

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

        <Line
          data={ data.items }
          xScale={ xScale }
          yScale={ yScale }
          color={ data.color }
          animation="left"
        />
        <Area
          data={ data.items }
          color={ data.color }
          xScale={ xScale }
          yScale={ yScale }
        />

        <Axis
          type="left"
          scale={ yScale }
          transform="translate(0, -10)"
          ticks={ 5 }
          tickFormat={ yTickFormat }
        />
        <Axis
          type="bottom"
          scale={ xScale }
          transform={ `translate(10, ${ height - height / 6 })` }
          ticks={ 5 }
        />
      </g>
    </svg>
  );
};

export default EthereumDailyTxsChart;
