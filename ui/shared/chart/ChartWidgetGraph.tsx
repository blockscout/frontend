import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React, { useEffect, useMemo } from 'react';

import type { ChartMargin, TimeChartItem } from 'ui/shared/chart/types';

import dayjs from 'lib/date/dayjs';
import useClientRect from 'lib/hooks/useClientRect';
import useIsMobile from 'lib/hooks/useIsMobile';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartSelectionX from 'ui/shared/chart/ChartSelectionX';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';
import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';

interface Props {
  isEnlarged?: boolean;
  title: string;
  units?: string;
  items: Array<TimeChartItem>;
  onZoom: () => void;
  isZoomResetInitial: boolean;
  margin?: ChartMargin;
}

// temporarily turn off the data aggregation, we need a better algorithm for that
const MAX_SHOW_ITEMS = 100_000_000_000;
const DEFAULT_CHART_MARGIN = { bottom: 20, left: 40, right: 20, top: 10 };

const ChartWidgetGraph = ({ isEnlarged, items, onZoom, isZoomResetInitial, title, margin, units }: Props) => {
  const isMobile = useIsMobile();
  const color = useToken('colors', 'blue.200');
  const overlayRef = React.useRef<SVGRectElement>(null);

  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const chartMargin = { ...DEFAULT_CHART_MARGIN, ...margin };
  const { innerWidth, innerHeight } = calculateInnerSize(rect, chartMargin);

  const chartId = `chart-${ title.split(' ').join('') }-${ isEnlarged ? 'fullscreen' : 'small' }`;
  const [ range, setRange ] = React.useState<[ Date, Date ]>([ items[0].date, items[items.length - 1].date ]);

  const rangedItems = useMemo(() =>
    items.filter((item) => item.date >= range[0] && item.date <= range[1]),
  [ items, range ]);
  const isGroupedValues = rangedItems.length > MAX_SHOW_ITEMS;

  const displayedData = useMemo(() => {
    if (isGroupedValues) {
      return groupChartItemsByWeekNumber(rangedItems);
    } else {
      return rangedItems;
    }
  }, [ isGroupedValues, rangedItems ]);
  const chartData = React.useMemo(() => ([ { items: displayedData, name: 'Value', color, units } ]), [ color, displayedData, units ]);

  const { xTickFormat, yTickFormat, xScale, yScale } = useTimeChartController({
    data: [ { items: displayedData, name: title, color } ],
    width: innerWidth,
    height: innerHeight,
  });

  const handleRangeSelect = React.useCallback((nextRange: [ Date, Date ]) => {
    setRange([ nextRange[0], nextRange[1] ]);
    onZoom();
  }, [ onZoom ]);

  useEffect(() => {
    if (isZoomResetInitial) {
      setRange([ items[0].date, items[items.length - 1].date ]);
    }
  }, [ isZoomResetInitial, items ]);

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer" id={ chartId } opacity={ rect ? 1 : 0 }>

      <g transform={ `translate(${ chartMargin?.left || 0 },${ chartMargin?.top || 0 })` }>
        <ChartGridLine
          type="horizontal"
          scale={ yScale }
          ticks={ isEnlarged ? 6 : 3 }
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
          animation="none"
          strokeWidth={ isMobile ? 1 : 2 }
        />

        <ChartAxis
          type="left"
          scale={ yScale }
          ticks={ isEnlarged ? 6 : 3 }
          tickFormatGenerator={ yTickFormat }
          disableAnimation
        />

        <ChartAxis
          type="bottom"
          scale={ xScale }
          transform={ `translate(0, ${ innerHeight })` }
          ticks={ isMobile ? 1 : 4 }
          anchorEl={ overlayRef.current }
          tickFormatGenerator={ xTickFormat }
          disableAnimation
        />

        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            tooltipWidth={ isGroupedValues ? 280 : 200 }
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
