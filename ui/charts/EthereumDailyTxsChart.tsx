import { useToken } from '@chakra-ui/react';
import React from 'react';

import json from 'data/charts_eth_txs.json';
import Area from 'ui/shared/graphs/Area';
import Axis from 'ui/shared/graphs/Axis';
import GridLine from 'ui/shared/graphs/GridLine';
import Line from 'ui/shared/graphs/Line';
import useTimeGraphController from 'ui/shared/graphs/useTimeGraphController';

const data = {
  items: json.map((d) => ({ ...d, date: new Date(d.date) })),
};

interface Props {
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const EthereumDailyTxsChart = ({ margin }: Props) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const [ rect, setRect ] = React.useState<{ width: number; height: number}>();

  React.useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    rect && setRect({ width: rect.width, height: rect.height });
  }, [ ]);

  const width = rect?.width || 0;
  const height = rect?.height || 0;

  const innerWidth = width - (margin?.left || 0) - (margin?.right || 0);
  const innerHeight = height - (margin?.bottom || 0) - (margin?.top || 0);

  const { yTickFormat, xScale, yScale } = useTimeGraphController({ data, width: innerWidth, height: innerHeight });

  const lineColor = useToken('colors', 'blue.500');

  return (
    <svg width={ width || '100%' } height={ height || '100%' } ref={ ref }>
      { width > 0 && (
        <g transform={ `translate(${ margin?.left || 0 },${ margin?.top || 0 })` }>
          { /* BASE GRID LINE */ }
          <GridLine
            type="horizontal"
            scale={ yScale }
            ticks={ 1 }
            size={ innerWidth }
            disableAnimation
          />

          { /* GIRD LINES */ }
          <GridLine
            type="vertical"
            scale={ xScale }
            ticks={ 5 }
            size={ innerHeight }
            transform={ `translate(0, ${ innerHeight })` }
          />
          <GridLine
            type="horizontal"
            scale={ yScale }
            ticks={ 5 }
            size={ innerWidth }
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
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ 5 }
          />
        </g>
      ) }
    </svg>
  );
};

export default React.memo(EthereumDailyTxsChart);
