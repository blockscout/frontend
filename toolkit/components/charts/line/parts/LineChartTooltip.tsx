import * as d3 from 'd3';
import React from 'react';

import { ChartResolution } from '../../types';
import type { LineChartData } from '../types';

import LineChartTooltipBackdrop, { useRenderBackdrop } from './tooltip/LineChartTooltipBackdrop';
import LineChartTooltipContent, { useRenderContent } from './tooltip/LineChartTooltipContent';
import LineChartTooltipLine, { useRenderLine } from './tooltip/LineChartTooltipLine';
import LineChartTooltipPoint, { useRenderPoints } from './tooltip/LineChartTooltipPoint';
import LineChartTooltipRow, { useRenderRows } from './tooltip/LineChartTooltipRow';
import LineChartTooltipTitle, { useRenderTitle } from './tooltip/LineChartTooltipTitle';
import { trackPointer } from './tooltip/pointerTracker';
import type { Pointer } from './tooltip/pointerTracker';

export interface LineChartTooltipProps {
  width?: number;
  tooltipWidth?: number;
  height?: number;
  data: LineChartData;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  anchorEl: SVGRectElement | null;
  noAnimation?: boolean;
  resolution?: ChartResolution;
}

export const LineChartTooltip = React.memo(({
  xScale,
  yScale,
  width,
  tooltipWidth = 200,
  height,
  data,
  anchorEl,
  noAnimation,
  resolution,
  ...props
}: LineChartTooltipProps) => {
  const ref = React.useRef<SVGGElement>(null);
  const trackerId = React.useRef<number>(undefined);
  const isVisible = React.useRef(false);

  const transitionDuration = !noAnimation ? 100 : null;

  const renderLine = useRenderLine(ref, height);
  const renderContent = useRenderContent(ref, { chart: { width, height }, transitionDuration });
  const renderPoints = useRenderPoints(ref, { data, xScale, yScale });
  const renderTitle = useRenderTitle(ref);
  const renderRows = useRenderRows(ref, { data, xScale, minWidth: tooltipWidth });
  const renderBackdrop = useRenderBackdrop(ref, { seriesNum: data.length, transitionDuration });

  const draw = React.useCallback((pointer: Pointer) => {
    if (pointer.point) {
      const { x, y, currentPoints } = renderPoints(pointer.point[0]);
      const isIncompleteData = currentPoints.some(({ item }) => item.isApproximate);
      renderLine(x);
      renderContent(x, y);
      renderTitle(isIncompleteData);
      const { width } = renderRows(x, currentPoints);
      renderBackdrop(width, isIncompleteData);
    }
  }, [ renderPoints, renderLine, renderContent, renderTitle, renderRows, renderBackdrop ]);

  const showContent = React.useCallback(() => {
    if (!isVisible.current) {
      if (transitionDuration) {
        d3.select(ref.current)
          .transition()
          .delay(transitionDuration)
          .attr('opacity', 1);
      } else {
        d3.select(ref.current)
          .attr('opacity', 1);
      }
      isVisible.current = true;
    }
  }, [ transitionDuration ]);

  const hideContent = React.useCallback(() => {
    if (transitionDuration) {
      d3.select(ref.current)
        .transition()
        .delay(transitionDuration)
        .attr('opacity', 0);
    } else {
      d3.select(ref.current)
        .attr('opacity', 0);
    }
    isVisible.current = false;
  }, [ transitionDuration ]);

  const createPointerTracker = React.useCallback((event: PointerEvent, isSubsequentCall?: boolean) => {
    let isPressed = event.pointerType === 'mouse' && event.type === 'pointerdown' && !isSubsequentCall;

    if (isPressed) {
      hideContent();
    }

    return trackPointer(event, {
      move: (pointer) => {
        if (!pointer.point || isPressed) {
          return;
        }
        draw(pointer);
        showContent();
      },
      out: () => {
        hideContent();
        trackerId.current = undefined;
      },
      end: () => {
        hideContent();
        trackerId.current = undefined;
        isPressed = false;
      },
    });
  }, [ draw, hideContent, showContent ]);

  React.useEffect(() => {
    const anchorD3 = d3.select(anchorEl);
    let isMultiTouch = false; // disabling creation of new tracker in multi touch mode

    anchorD3
      .on('touchmove.tooltip', (event: TouchEvent) => event.preventDefault()) // prevent scrolling
      .on(`touchstart.tooltip`, (event: TouchEvent) => {
        isMultiTouch = event.touches.length > 1;
      }, { passive: true })
      .on(`touchend.tooltip`, (event: TouchEvent) => {
        if (isMultiTouch && event.touches.length === 0) {
          isMultiTouch = false;
        }
      }, { passive: true })
      .on('pointerenter.tooltip pointerdown.tooltip', (event: PointerEvent) => {
        if (!isMultiTouch) {
          trackerId.current = createPointerTracker(event);
        }
      }, { passive: true })
      .on('pointermove.tooltip', (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && !isMultiTouch && trackerId.current === undefined) {
          trackerId.current = createPointerTracker(event);
        }
      }, { passive: true });

    return () => {
      anchorD3.on('touchmove.tooltip pointerenter.tooltip pointerdown.tooltip', null);
      trackerId.current && anchorD3.on(
        [ 'pointerup', 'pointercancel', 'lostpointercapture', 'pointermove', 'pointerout' ].map((event) => `${ event }.${ trackerId.current }`).join(' '),
        null,
      );
    };
  }, [ anchorEl, createPointerTracker, draw, hideContent, showContent ]);

  const lastItemDateString = data[0].items[data[0].items.length - 1]?.date?.toISOString();

  React.useEffect(() => {
    if (trackerId.current) {
      trackerId.current = undefined;
      hideContent();
    }
  }, [ hideContent, lastItemDateString ]);

  return (
    <g
      ref={ ref }
      opacity={ 0 }
      style={{
        fontWeight: '500',
        fontSize: '12px',
      }}
      { ...props }
    >
      <LineChartTooltipLine/>
      { data.map(({ name }) => <LineChartTooltipPoint key={ name }/>) }
      <LineChartTooltipContent>
        <LineChartTooltipBackdrop/>
        <LineChartTooltipTitle resolution={ resolution }/>
        <LineChartTooltipRow label={ getDateLabel(resolution) } lineNum={ 1 }/>
        { data.map(({ name }, index) => <LineChartTooltipRow key={ name } label={ name } lineNum={ index + 1 }/>) }
      </LineChartTooltipContent>
    </g>
  );
});

function getDateLabel(resolution?: ChartResolution): string {
  switch (resolution) {
    case ChartResolution.WEEK:
      return 'Dates';
    case ChartResolution.MONTH:
      return 'Month';
    case ChartResolution.YEAR:
      return 'Year';
    default:
      return 'Date';
  }
}
