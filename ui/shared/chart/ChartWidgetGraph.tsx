import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { ChartMargin, TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartSelectionX from 'ui/shared/chart/ChartSelectionX';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

interface Props {
  isEnlarged?: boolean;
  title: string;
  units?: string;
  items: Array<TimeChartItem>;
  onZoom: () => void;
  isZoomResetInitial: boolean;
  margin?: ChartMargin;
  noAnimation?: boolean;
}

// temporarily turn off the data aggregation, we need a better algorithm for that
const MAX_SHOW_ITEMS = 100_000_000_000;
const DEFAULT_CHART_MARGIN = { bottom: 20, left: 10, right: 20, top: 10 };

const ChartWidgetGraph = ({ isEnlarged, items, onZoom, isZoomResetInitial, title, margin: marginProps, units, noAnimation }: Props) => {
  const isMobile = useIsMobile();
  const color = useToken('colors', 'blue.200');
  const chartId = `chart-${ title.split(' ').join('') }-${ isEnlarged ? 'fullscreen' : 'small' }`;

  const overlayRef = React.useRef<SVGRectElement>(null);

  const [ range, setRange ] = React.useState<[ Date, Date ]>([ items[0].date, items[items.length - 1].date ]);

  const rangedItems = React.useMemo(() =>
    items.filter((item) => item.date >= range[0] && item.date <= range[1]),
  [ items, range ]);
  const isGroupedValues = rangedItems.length > MAX_SHOW_ITEMS;

  const displayedData = React.useMemo(() => {
    if (isGroupedValues) {
      return groupChartItemsByWeekNumber(rangedItems);
    } else {
      return rangedItems;
    }
  }, [ isGroupedValues, rangedItems ]);

  const chartData: TimeChartData = React.useMemo(() => ([ { items: displayedData, name: 'Value', color, units } ]), [ color, displayedData, units ]);

  const margin: ChartMargin = React.useMemo(() => ({ ...DEFAULT_CHART_MARGIN, ...marginProps }), [ marginProps ]);
  const axesConfig = React.useMemo(() => {
    return {
      x: {
        ticks: isEnlarged ? 8 : 4,
      },
      y: {
        ticks: isEnlarged ? 6 : 3,
        nice: true,
      },
    };
  }, [ isEnlarged ]);

  const {
    ref,
    rect,
    innerWidth,
    innerHeight,
    chartMargin,
    axes,
  } = useTimeChartController({
    data: chartData,
    margin,
    axesConfig,
  });

  const handleRangeSelect = React.useCallback((nextRange: [ Date, Date ]) => {
    setRange([ nextRange[0], nextRange[1] ]);
    onZoom();
  }, [ onZoom ]);

  React.useEffect(() => {
    if (isZoomResetInitial) {
      setRange([ items[0].date, items[items.length - 1].date ]);
    }
  }, [ isZoomResetInitial, items ]);

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer" id={ chartId } opacity={ rect ? 1 : 0 }>

      <g transform={ `translate(${ chartMargin?.left || 0 },${ chartMargin?.top || 0 })` }>
        <ChartGridLine
          type="horizontal"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          size={ innerWidth }
          noAnimation
        />

        <ChartArea
          id={ chartId }
          data={ displayedData }
          color={ color }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          noAnimation={ noAnimation }
        />

        <ChartLine
          data={ displayedData }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          stroke={ color }
          animation="none"
          strokeWidth={ isMobile ? 1 : 2 }
        />

        <ChartAxis
          type="left"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          tickFormatGenerator={ axes.y.tickFormatter }
          noAnimation
        />

        <ChartAxis
          type="bottom"
          scale={ axes.x.scale }
          transform={ `translate(0, ${ innerHeight })` }
          ticks={ axesConfig.x.ticks }
          anchorEl={ overlayRef.current }
          tickFormatGenerator={ axes.x.tickFormatter }
          noAnimation
        />

        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            tooltipWidth={ isGroupedValues ? 280 : 200 }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ chartData }
            noAnimation={ noAnimation }
          />

          <ChartSelectionX
            anchorEl={ overlayRef.current }
            height={ innerHeight }
            scale={ axes.x.scale }
            data={ chartData }
            onSelect={ handleRangeSelect }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChartWidgetGraph);

function groupChartItemsByWeekNumber(items: Array<TimeChartItem>): Array<TimeChartItem> {
  return d3.rollups(items,
    (group) => ({
      date: group[0].date,
      value: d3.sum(group, (d) => d.value),
      dateLabel: `${ d3.timeFormat('%e %b %Y')(group[0].date) } – ${ d3.timeFormat('%e %b %Y')(group[group.length - 1].date) }`,
    }),
    (t) => `${ dayjs(t.date).week() } / ${ dayjs(t.date).year() }`,
  ).map(([ , v ]) => v);
}
