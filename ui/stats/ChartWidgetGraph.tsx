import { useToken } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartSelectionX from 'ui/shared/chart/ChartSelectionX';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useChartSize from 'ui/shared/chart/useChartSize';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

interface Props {
  title: string;
  items: Array<TimeChartItem>;
  onZoom: () => void;
  isZoomResetInitial: boolean;
}

const CHART_MARGIN = { bottom: 20, left: 52, right: 30, top: 10 };

const ChartWidgetGraph = ({ items, onZoom, isZoomResetInitial, title }: Props) => {
  const isMobile = useIsMobile();
  const ref = React.useRef<SVGSVGElement>(null);
  const color = useToken('colors', 'blue.200');
  const overlayRef = React.useRef<SVGRectElement>(null);
  const chartId = useMemo(() => `chart-${ crypto.randomUUID() }`, []);
  const [ range, setRange ] = React.useState<[ number, number ]>([ 0, Infinity ]);
  const { innerWidth, innerHeight } = useChartSize(ref.current, CHART_MARGIN);

  const displayedData = useMemo(() => items.slice(range[0], range[1]).map((d) =>
    ({ ...d, date: new Date(d.date) })), [ items, range ]);
  const chartData = [ { items: items, name: 'Value', color } ];

  const { yTickFormat, xScale, yScale } = useTimeChartController({
    data: [ { items: displayedData, name: title, color } ],
    width: innerWidth,
    height: innerHeight,
  });

  const handleRangeSelect = React.useCallback((nextRange: [ number, number ]) => {
    setRange([ range[0] + nextRange[0], range[0] + nextRange[1] ]);
    onZoom();
  }, [ onZoom, range ]);

  useEffect(() => {
    if (isZoomResetInitial) {
      setRange([ 0, Infinity ]);
    }
  }, [ isZoomResetInitial ]);

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer" id={ chartId }>

      <g transform={ `translate(${ CHART_MARGIN?.left || 0 },${ CHART_MARGIN?.top || 0 })` } opacity={ 1 }>
        <ChartGridLine
          type="horizontal"
          scale={ yScale }
          ticks={ 3 }
          size={ innerWidth }
          disableAnimation
        />

        <ChartArea
          id={ chartId }
          data={ displayedData }
          color={ color }
          xScale={ xScale }
          yScale={ yScale }
        />

        <ChartLine
          data={ displayedData }
          xScale={ xScale }
          yScale={ yScale }
          stroke={ color }
          animation="left"
          strokeWidth={ 3 }
        />

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
            ticks={ isMobile ? 1 : 3 }
            anchorEl={ overlayRef.current }
            disableAnimation
          />

          <ChartTooltip
            chartId={ chartId }
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            xScale={ xScale }
            yScale={ yScale }
            data={ chartData }
          />

          <ChartSelectionX
            anchorEl={ overlayRef.current }
            height={ innerHeight }
            scale={ xScale }
            data={ chartData }
            onSelect={ handleRangeSelect }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChartWidgetGraph);
