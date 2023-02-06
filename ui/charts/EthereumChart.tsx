import { useToken, Button, Box } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import ethTokenTransferData from 'data/charts_eth_token_transfer.json';
import ethTxsData from 'data/charts_eth_txs.json';
import dayjs from 'lib/date/dayjs';
import useClientRect from 'lib/hooks/useClientRect';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLegend from 'ui/shared/chart/ChartLegend';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartSelectionX from 'ui/shared/chart/ChartSelectionX';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
// import useBrushX from 'ui/shared/chart/useBrushX';
import useChartLegend from 'ui/shared/chart/useChartLegend';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';

const CHART_MARGIN = { bottom: 20, left: 65, right: 30, top: 10 };
const CHART_OFFSET = {
  y: 26, // legend height
};
const RANGE_DEFAULT_START_DATE = dayjs.min(dayjs(ethTokenTransferData[0].date), dayjs(ethTxsData[0].date)).toDate();
const RANGE_DEFAULT_LAST_DATE = dayjs.max(dayjs(ethTokenTransferData.at(-1)?.date), dayjs(ethTxsData.at(-1)?.date)).toDate();

const EthereumChart = () => {
  const overlayRef = React.useRef<SVGRectElement>(null);

  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const { innerWidth, innerHeight } = calculateInnerSize(rect, CHART_MARGIN, CHART_OFFSET);
  const [ range, setRange ] = React.useState<[ Date, Date ]>([ RANGE_DEFAULT_START_DATE, RANGE_DEFAULT_LAST_DATE ]);

  const data: TimeChartData = [
    {
      name: 'Daily txs',
      color: useToken('colors', 'blue.500'),
      items: ethTxsData
        .map((d) => ({ ...d, date: new Date(d.date) }))
        .filter((d) => d.date >= range[0] && d.date <= range[1]),
    },
    {
      name: 'ERC-20 tr.',
      color: useToken('colors', 'green.500'),
      items: ethTokenTransferData
        .map((d) => ({ ...d, date: new Date(d.date) }))
        .filter((d) => d.date >= range[0] && d.date <= range[1]),
    },
  ];

  const { selectedLines, handleLegendItemClick } = useChartLegend(data.length);
  const filteredData = data.filter((_, index) => selectedLines.includes(index));

  const { yTickFormat, xScale, yScale } = useTimeChartController({
    data: filteredData.length === 0 ? data : filteredData,
    width: innerWidth,
    height: innerHeight,
  });

  const handleRangeSelect = React.useCallback((nextRange: [ Date, Date ]) => {
    setRange([ nextRange[0], nextRange[1] ]);
  }, [ ]);

  const handleZoomReset = React.useCallback(() => {
    setRange([ RANGE_DEFAULT_START_DATE, RANGE_DEFAULT_LAST_DATE ]);
  }, [ ]);

  // uncomment if we need brush the chart
  // const brushLimits = React.useMemo(() => (
  //   [ [ 0, innerHeight ], [ innerWidth, height ] ] as [[number, number], [number, number]]
  // ), [ height, innerHeight, innerWidth ]);
  // useBrushX({ anchor: ref.current, limits: brushLimits, setRange });

  return (
    <Box display="inline-block" position="relative" width="100%" height="100%">
      <svg width="100%" height="calc(100% - 26px)" ref={ ref }>
        <g transform={ `translate(${ CHART_MARGIN?.left || 0 },${ CHART_MARGIN?.top || 0 })` } opacity={ rect ? 1 : 0 }>
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
          { filteredData.map((d) => (
            <ChartLine
              key={ d.name }
              data={ d.items }
              xScale={ xScale }
              yScale={ yScale }
              stroke={ d.color }
              animation="left"
            />
          )) }
          { filteredData.map((d) => (
            <ChartArea
              key={ d.name }
              data={ d.items }
              color={ d.color }
              xScale={ xScale }
              yScale={ yScale }
            />
          )) }

          { /* AXISES */ }
          <ChartAxis
            type="left"
            scale={ yScale }
            ticks={ 5 }
            tickFormatGenerator={ yTickFormat }
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
            { filteredData.length > 0 && (
              <ChartTooltip
                anchorEl={ overlayRef.current }
                width={ innerWidth }
                height={ innerHeight }
                xScale={ xScale }
                yScale={ yScale }
                data={ filteredData }
              />
            ) }
            { filteredData.length > 0 && (
              <ChartSelectionX
                anchorEl={ overlayRef.current }
                height={ innerHeight }
                scale={ xScale }
                data={ filteredData }
                onSelect={ handleRangeSelect }
              />
            ) }
          </ChartOverlay>
        </g>
      </svg>
      { (range[0] !== RANGE_DEFAULT_START_DATE || range[1] !== RANGE_DEFAULT_LAST_DATE) && (
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
      <ChartLegend data={ data } selectedIndexes={ selectedLines } onClick={ handleLegendItemClick }/>
    </Box>
  );
};

export default React.memo(EthereumChart);
