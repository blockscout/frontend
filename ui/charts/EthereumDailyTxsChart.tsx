import { useToken, Button, Box } from '@chakra-ui/react';
import React from 'react';

import json from 'data/charts_eth_txs.json';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartSelectionX from 'ui/shared/chart/ChartSelectionX';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useBrushX from 'ui/shared/chart/useBrushX';
import useChartSize from 'ui/shared/chart/useChartSize';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

const CHART_MARGIN = { bottom: 20, left: 65, right: 30, top: 10 };

const EthereumDailyTxsChart = () => {
  const ref = React.useRef<SVGSVGElement>(null);
  const overlayRef = React.useRef<SVGRectElement>(null);

  const { width, height, innerWidth, innerHeight } = useChartSize(ref.current, CHART_MARGIN);
  const [ range, setRange ] = React.useState<[number, number]>([ 0, Infinity ]);

  const brushLimits = React.useMemo(() => (
    [ [ 0, innerHeight ], [ innerWidth, height ] ] as [[number, number], [number, number]]
  ), [ height, innerHeight, innerWidth ]);
  useBrushX({ anchor: ref.current, limits: brushLimits, setRange });

  const data = {
    items: json.slice(range[0], range[1]).map((d) => ({ ...d, date: new Date(d.date) })),
  };
  const { yTickFormat, xScale, yScale } = useTimeChartController({ data, width: innerWidth, height: innerHeight });

  const lineColor = useToken('colors', 'blue.500');

  const handleRangeSelect = React.useCallback((nextRange: [number, number]) => {
    setRange([ range[0] + nextRange[0], range[0] + nextRange[1] ]);
  }, [ range ]);

  const handleZoomReset = React.useCallback(() => {
    setRange([ 0, Infinity ]);
  }, [ ]);

  return (
    <Box display="inline" position="relative">
      <svg width={ width || '100%' } height={ height || '100%' } ref={ ref }>
        <g transform={ `translate(${ CHART_MARGIN?.left || 0 },${ CHART_MARGIN?.top || 0 })` } opacity={ width ? 1 : 0 }>
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
              margin={ CHART_MARGIN }
              xScale={ xScale }
              yScale={ yScale }
              data={ data }
            />
            <ChartSelectionX
              anchorEl={ overlayRef.current }
              height={ innerHeight }
              scale={ xScale }
              data={ data }
              onSelect={ handleRangeSelect }
            />
          </ChartOverlay>
        </g>
      </svg>
      { (range[0] !== 0 || range[1] !== Infinity) && (
        <Button
          size="sm"
          variant="outline"
          position="absolute"
          top={ `${ CHART_MARGIN?.top || 0 }px` }
          right={ `${ CHART_MARGIN?.right || 0 }px` }
          onClick={ handleZoomReset }
        >
            Reset zoom
        </Button>
      ) }
    </Box>
  );
};

export default React.memo(EthereumDailyTxsChart);
