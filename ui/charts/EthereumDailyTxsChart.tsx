import { useToken } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React from 'react';

import json from 'data/charts_eth_txs.json';
import Area from 'ui/shared/graphs/Area';
import Axis from 'ui/shared/graphs/Axis';
import GridLine from 'ui/shared/graphs/GridLine';
import Line from 'ui/shared/graphs/Line';
import Overlay from 'ui/shared/graphs/Overlay';
import Tooltip from 'ui/shared/graphs/Tooltip';
import useBrushX from 'ui/shared/graphs/useBrushX';
import useTimeGraphController from 'ui/shared/graphs/useTimeGraphController';

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
  const overlayRef = React.useRef<SVGRectElement>(null);

  const [ rect, setRect ] = React.useState<{ width: number; height: number}>({ width: 0, height: 0 });

  const calculateRect = React.useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    return { width: rect?.width || 0, height: rect?.height || 0 };
  }, []);

  React.useEffect(() => {
    setRect(calculateRect());
  }, [ calculateRect ]);

  React.useEffect(() => {
    let timeoutId: number;
    const resizeHandler = _debounce(() => {
      setRect({ width: 0, height: 0 });
      timeoutId = window.setTimeout(() => {
        setRect(calculateRect());
      }, 0);
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
      window.clearTimeout(timeoutId);
    };
  }, [ calculateRect ]);

  const { width, height } = rect;
  const innerWidth = Math.max(width - (margin?.left || 0) - (margin?.right || 0), 0);
  const innerHeight = Math.max(height - (margin?.bottom || 0) - (margin?.top || 0), 0);

  const brushLimits = React.useMemo(() => (
    [ [ 0, innerHeight ], [ innerWidth, height ] ] as [[number, number], [number, number]]
  ), [ height, innerHeight, innerWidth ]);
  const range = useBrushX({ anchor: ref.current, limits: brushLimits });

  const data = {
    items: json.slice(range[0], range[1]).map((d) => ({ ...d, date: new Date(d.date) })),
  };
  const { yTickFormat, xScale, yScale } = useTimeGraphController({ data, width: innerWidth, height: innerHeight });

  const lineColor = useToken('colors', 'blue.500');

  return (
    <svg width={ width || '100%' } height={ height || '100%' } ref={ ref }>
      <g transform={ `translate(${ margin?.left || 0 },${ margin?.top || 0 })` } opacity={ width ? 1 : 0 }>
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
          disableAnimation
        />
        <GridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 5 }
          size={ innerWidth }
          disableAnimation
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
          disableAnimation
        />
        <Overlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <Axis
            type="bottom"
            scale={ xScale }
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ 5 }
            anchorEl={ overlayRef.current }
            disableAnimation
          />
          <Tooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            margin={ margin }
            xScale={ xScale }
            yScale={ yScale }
            data={ data }
          />
        </Overlay>
      </g>
    </svg>
  );
};

export default React.memo(EthereumDailyTxsChart);
