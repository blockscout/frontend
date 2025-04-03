import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { ChartMargin, TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

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
  zoomRange?: [ Date, Date ];
  onZoom: (range: [ Date, Date ]) => void;
  margin?: ChartMargin;
  noAnimation?: boolean;
  resolution?: Resolution;
}

const DEFAULT_CHART_MARGIN = { bottom: 20, left: 10, right: 20, top: 10 };

const ChartWidgetGraph = ({
  isEnlarged,
  items,
  onZoom,
  title,
  margin: marginProps,
  units,
  noAnimation,
  resolution,
  zoomRange,
}: Props) => {
  const isMobile = useIsMobile();
  const [ color ] = useToken('colors', 'blue.200');
  const chartId = `chart-${ title.split(' ').join('') }-${ isEnlarged ? 'fullscreen' : 'small' }`;

  const overlayRef = React.useRef<SVGRectElement>(null);

  const range = React.useMemo(() => zoomRange || [ items[0].date, items[items.length - 1].date ], [ zoomRange, items ]);

  const displayedData = React.useMemo(() =>
    items
      .filter((item) => item.date >= range[0] && item.date <= range[1])
      .map((item) => ({
        ...item,
        dateLabel: getDateLabel(item.date, item.date_to, resolution),
      })),
  [ items, range, resolution ]);

  const chartData: TimeChartData = React.useMemo(() => ([ { items: displayedData, name: 'Value', color, units } ]), [ color, displayedData, units ]);

  const margin: ChartMargin = React.useMemo(() => ({ ...DEFAULT_CHART_MARGIN, ...marginProps }), [ marginProps ]);
  const axesConfig = React.useMemo(() => {
    return {
      x: {
        ticks: isEnlarged && !isMobile ? 8 : 4,
      },
      y: {
        ticks: isEnlarged ? 6 : 3,
        nice: true,
      },
    };
  }, [ isEnlarged, isMobile ]);

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
            tooltipWidth={ (resolution === Resolution.WEEK) ? 280 : 200 }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ chartData }
            noAnimation={ noAnimation }
            resolution={ resolution }
          />

          <ChartSelectionX
            anchorEl={ overlayRef.current }
            height={ innerHeight }
            scale={ axes.x.scale }
            data={ chartData }
            onSelect={ onZoom }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChartWidgetGraph);

function getDateLabel(date: Date, dateTo?: Date, resolution?: Resolution): string {
  switch (resolution) {
    case Resolution.WEEK:
      return d3.timeFormat('%e %b %Y')(date) + (dateTo ? ` – ${ d3.timeFormat('%e %b %Y')(dateTo) }` : '');
    case Resolution.MONTH:
      return d3.timeFormat('%b %Y')(date);
    case Resolution.YEAR:
      return d3.timeFormat('%Y')(date);
    default:
      return d3.timeFormat('%e %b %Y')(date);
  }
}
