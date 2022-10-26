import { useToken } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React from 'react';

import json from 'data/charts_eth_txs.json';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useBrushX from 'ui/shared/chart/useBrushX';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

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
  const { yTickFormat, xScale, yScale } = useTimeChartController({ data, width: innerWidth, height: innerHeight });

  const lineColor = useToken('colors', 'blue.500');

  return (
    <svg width={ width || '100%' } height={ height || '100%' } ref={ ref }>
      <g transform={ `translate(${ margin?.left || 0 },${ margin?.top || 0 })` } opacity={ width ? 1 : 0 }>
        { /* BASE GRID LINE */ }
        <ChartGridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 1 }
          size={ innerWidth }
          disableAnimation
        />

        { /* GIRD LINES */ }
        <ChartGridLine
          type="vertical"
          scale={ xScale }
          ticks={ 5 }
          size={ innerHeight }
          transform={ `translate(0, ${ innerHeight })` }
          disableAnimation
        />
        <ChartGridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 5 }
          size={ innerWidth }
          disableAnimation
        />

        { /* GRAPH */ }
        <ChartLine
          data={ data.items }
          xScale={ xScale }
          yScale={ yScale }
          stroke={ lineColor }
          animation="left"
        />
        <ChartArea
          data={ data.items }
          color={ lineColor }
          xScale={ xScale }
          yScale={ yScale }
        />

        { /* AXISES */ }
        <ChartAxis
          type="left"
          scale={ yScale }
          ticks={ 5 }
          tickFormat={ yTickFormat }
          disableAnimation
        />
        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartAxis
            type="bottom"
            scale={ xScale }
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ 5 }
            anchorEl={ overlayRef.current }
            disableAnimation
          />
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            margin={ margin }
            xScale={ xScale }
            yScale={ yScale }
            data={ data }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(EthereumDailyTxsChart);
