import { defaultsDeep } from 'es-toolkit/compat';
import React from 'react';

import type { ChartMargin } from '../types';
import { ChartResolution } from '../types';
import type { LineChartAxesConfigFn, LineChartData } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';

import { LineChartArea } from './parts/LineChartArea';
import { LineChartAxis } from './parts/LineChartAxis';
import { LineChartGridLine } from './parts/LineChartGridLine';
import { LineChartLine } from './parts/LineChartLine';
import { LineChartOverlay } from './parts/LineChartOverlay';
import { LineChartSelectionX } from './parts/LineChartSelectionX';
import { LineChartTooltip } from './parts/LineChartTooltip';
import { getDateLabel } from './utils/getDateLabel';
import { useLineChartController } from './utils/useLineChartController';

export interface LineChartProps {
  charts: LineChartData;
  zoomRange?: [ Date, Date ];
  onZoom: (range: [ Date, Date ]) => void;
  margin?: ChartMargin;
  noAnimation?: boolean;
  resolution?: ChartResolution;
  axesConfig?: LineChartAxesConfigFn;
  isEnlarged?: boolean;
}

const DEFAULT_CHART_MARGIN = { bottom: 20, left: 10, right: 20, top: 10 };

export const LineChart = React.memo(({
  isEnlarged,
  charts,
  onZoom,
  margin: marginProps,
  noAnimation,
  resolution,
  zoomRange,
  axesConfig: axesConfigProps,
}: LineChartProps) => {
  const isMobile = useIsMobile();

  const overlayRef = React.useRef<SVGRectElement>(null);

  const range = React.useMemo(
    () =>
      zoomRange || [
        charts[0].items[0].date,
        charts[0].items[charts[0].items.length - 1].date,
      ],
    [ zoomRange, charts ],
  );

  const displayedCharts = React.useMemo(() => {
    return charts.map((chart) => ({
      ...chart,
      items: chart.items
        .filter((item) => item.date >= range[0] && item.date <= range[1])
        .map((item) => (item.dateLabel ? item : {
          ...item,
          dateLabel: getDateLabel(item.date, item.date_to, resolution),
        })),
    }));
  }, [ charts, range, resolution ]);

  const margin: ChartMargin = React.useMemo(() => ({ ...DEFAULT_CHART_MARGIN, ...marginProps }), [ marginProps ]);

  const axesConfig = React.useMemo(() => {
    return defaultsDeep(axesConfigProps?.({ isEnlarged, isMobile }), {
      x: {
        ticks: isEnlarged && !isMobile ? 8 : 4,
      },
      y: {
        ticks: isEnlarged ? 6 : 3,
        nice: true,
      },
    });
  }, [ axesConfigProps, isEnlarged, isMobile ]);

  const {
    ref,
    rect,
    innerWidth,
    innerHeight,
    chartMargin,
    axes,
  } = useLineChartController({
    data: displayedCharts,
    margin,
    axesConfig,
  });

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer" opacity={ rect ? 1 : 0 }>

      <g transform={ `translate(${ chartMargin?.left || 0 },${ chartMargin?.top || 0 })` }>
        <LineChartGridLine
          type="horizontal"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          size={ innerWidth }
          noAnimation
        />

        { displayedCharts.map((chart) => {
          const id = `${ chart.id }-${ isEnlarged ? 'fullscreen' : 'small' }`;
          return (
            <React.Fragment key={ id }>
              { chart.charts.map((chartConfig) => {

                if (chartConfig.type === 'area') {
                  return (
                    <LineChartArea
                      key={ chartConfig.type }
                      id={ id }
                      data={ chart.items }
                      gradient={ chartConfig.gradient }
                      xScale={ axes.x.scale }
                      yScale={ axes.y.scale }
                      noAnimation={ noAnimation }
                    />
                  );
                }

                return (
                  <LineChartLine
                    key={ chartConfig.type }
                    data={ chart.items }
                    xScale={ axes.x.scale }
                    yScale={ axes.y.scale }
                    stroke={ chartConfig.color }
                    strokeWidth={ chartConfig.strokeWidth || 2 }
                    strokeDasharray={ chartConfig.strokeDasharray }
                    animation="none"
                  />
                );
              }) }
            </React.Fragment>
          );
        }) }

        <LineChartAxis
          type="left"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          tickFormatGenerator={ axes.y.tickFormatter }
          noAnimation
        />

        <LineChartAxis
          type="bottom"
          scale={ axes.x.scale }
          transform={ `translate(0, ${ innerHeight })` }
          ticks={ axesConfig.x.ticks }
          anchorEl={ overlayRef.current }
          tickFormatGenerator={ axes.x.tickFormatter }
          noAnimation
        />

        <LineChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <LineChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            tooltipWidth={ (resolution === ChartResolution.WEEK) ? 280 : 200 }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ displayedCharts }
            noAnimation={ noAnimation }
            resolution={ resolution }
          />

          <LineChartSelectionX
            anchorEl={ overlayRef.current }
            height={ innerHeight }
            scale={ axes.x.scale }
            data={ displayedCharts }
            onSelect={ onZoom }
          />
        </LineChartOverlay>
      </g>
    </svg>
  );
});
