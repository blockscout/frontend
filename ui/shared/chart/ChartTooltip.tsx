import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem, TimeChartData } from 'ui/shared/chart/types';

import computeTooltipPosition from 'ui/shared/chart/utils/computeTooltipPosition';
import type { Pointer } from 'ui/shared/chart/utils/pointerTracker';
import { trackPointer } from 'ui/shared/chart/utils/pointerTracker';

import ChartTooltipBackdrop from './tooltip/ChartTooltipBackdrop';
import ChartTooltipLine from './tooltip/ChartTooltipLine';
import ChartTooltipPoint from './tooltip/ChartTooltipPoint';
import ChartTooltipRow from './tooltip/ChartTooltipRow';
import ChartTooltipTitle from './tooltip/ChartTooltipTitle';

interface Props {
  width?: number;
  tooltipWidth?: number;
  height?: number;
  data: TimeChartData;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  anchorEl: SVGRectElement | null;
}

interface CurrentItem {
  point: TimeChartItem;
  index: number;
}

const TEXT_LINE_HEIGHT = 12;
const PADDING = 16;
const LINE_SPACE = 10;
const POINT_SIZE = 16;
const LABEL_WIDTH = 80;

const calculateHeight = (seriesNum: number, isIncomplete?: boolean) => {
  const linesNum = isIncomplete ? seriesNum + 2 : seriesNum + 1;

  return 2 * PADDING + linesNum * TEXT_LINE_HEIGHT + (linesNum - 1) * LINE_SPACE;
};

const calculateRowTransformValue = (rowNum: number) => {
  return `translate(${ PADDING },${ PADDING + rowNum * (LINE_SPACE + TEXT_LINE_HEIGHT) })`;
};

const ChartTooltip = ({ xScale, yScale, width, tooltipWidth = 200, height, data, anchorEl, ...props }: Props) => {
  const ref = React.useRef(null);
  const trackerId = React.useRef<number>();
  const isVisible = React.useRef(false);

  const drawLine = React.useCallback(
    (x: number) => {
      d3.select(ref.current)
        .select('.ChartTooltip__line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', 0)
        .attr('y2', height || 0);
    },
    [ ref, height ],
  );

  const updateDisplayedValue = React.useCallback((d: TimeChartItem, i: number) => {

    // UPDATE TOOLTIP DIMENSIONS
    // TODO @tom2drum move to "updateContent" function
    const valueNodes = d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__value')
      // here we assume that the first value is date
      .filter((td, tIndex) => tIndex === i + 1)
      .text(
        (data[i].valueFormatter?.(d.value) || d.value.toLocaleString(undefined, { minimumSignificantDigits: 1 })) +
        (data[i].units ? ` ${ data[i].units }` : ''),
      )
      .nodes();

    const widthLimit = tooltipWidth - 2 * PADDING - LABEL_WIDTH;
    const width = valueNodes.map((node) => node?.getBoundingClientRect?.().width);
    const maxNodeWidth = Math.max(...width);
    d3.select(ref.current)
      .select('.ChartTooltip__backdrop')
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('width', tooltipWidth + Math.max(0, (maxNodeWidth - widthLimit)))
      .attr('height', calculateHeight(data.length, d.isApproximate));

    // UPDATE "TRANSFORM" PROPs OF LABELS AND VALUES
    d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__row')
      .attr('transform', (datum, index) => {
        return calculateRowTransformValue(index - (d.isApproximate ? 0 : 1));
      });

    // UPDATE VISIBILITY OF TITLE
    d3.select(ref.current)
      .select('.ChartTooltip__title')
      .attr('opacity', d.isApproximate ? 1 : 0);

  }, [ data, tooltipWidth ]);

  const drawContent = React.useCallback(
    (x: number, y: number, currentItems: Array<CurrentItem>) => {
      const tooltipContent = d3.select(ref.current).select('.ChartTooltip__content');

      tooltipContent.attr('transform', (cur, i, nodes) => {
        const node = nodes[i] as SVGGElement | null;
        const { width: nodeWidth, height: nodeHeight } = node?.getBoundingClientRect() || { width: 0, height: 0 };
        const [ translateX, translateY ] = computeTooltipPosition({
          canvasWidth: width || 0,
          canvasHeight: height || 0,
          nodeWidth,
          nodeHeight,
          pointX: x,
          pointY: y,
          offset: POINT_SIZE,
        });
        return `translate(${ translateX }, ${ translateY })`;
      });

      const date = xScale.invert(x);
      const dateLabel = data[0].items.find((item) => item.date.getTime() === date.getTime())?.dateLabel;

      // here we assume that the first value is date
      tooltipContent
        .select('.ChartTooltip__value')
        .text(dateLabel || d3.timeFormat('%e %b %Y')(xScale.invert(x)));

      currentItems.forEach(({ point, index }) => {
        updateDisplayedValue(point, index);
      });
    },
    [ xScale, data, updateDisplayedValue, width, height ],
  );

  const drawPoints: (x: number) => [number, number, Array<CurrentItem>] = React.useCallback((x: number) => {
    const xDate = xScale.invert(x);
    const bisectDate = d3.bisector<TimeChartItem, unknown>((d) => d.date).left;
    let baseXPos = 0;
    let baseYPos = 0;
    const currentItems: Array<CurrentItem> = [];

    d3.select(ref.current)
      .selectAll('.ChartTooltip__point')
      .attr('transform', (cur, i) => {
        const index = bisectDate(data[i].items, xDate, 1);
        const d0 = data[i].items[index - 1] as TimeChartItem | undefined;
        const d1 = data[i].items[index] as TimeChartItem | undefined;
        const d = (() => {
          if (!d0) {
            return d1;
          }
          if (!d1) {
            return d0;
          }
          return xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;
        })();

        if (d?.date === undefined && d?.value === undefined) {
          // move point out of container
          return 'translate(-100,-100)';
        }

        const xPos = xScale(d.date);
        const yPos = yScale(d.value);

        if (i === 0) {
          baseXPos = xPos;
          baseYPos = yPos;
        }

        currentItems.push({ point: d, index: i });

        return `translate(${ xPos }, ${ yPos })`;
      });

    return [ baseXPos, baseYPos, currentItems ];
  }, [ data, xScale, yScale ]);

  const draw = React.useCallback((pointer: Pointer) => {
    if (pointer.point) {
      const [ baseXPos, baseYPos, currentItems ] = drawPoints(pointer.point[0]);
      drawLine(baseXPos);
      drawContent(baseXPos, baseYPos, currentItems);
    }
  }, [ drawPoints, drawLine, drawContent ]);

  const showContent = React.useCallback(() => {
    if (!isVisible.current) {
      d3.select(ref.current).attr('opacity', 1);
      d3.select(ref.current)
        .selectAll('.ChartTooltip__point')
        .attr('opacity', 1);
      isVisible.current = true;
    }
  }, []);

  const hideContent = React.useCallback(() => {
    d3.select(ref.current).attr('opacity', 0);
    isVisible.current = false;
  }, []);

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
      })
      .on(`touchend.tooltip`, (event: TouchEvent) => {
        if (isMultiTouch && event.touches.length === 0) {
          isMultiTouch = false;
        }
      })
      .on('pointerenter.tooltip pointerdown.tooltip', (event: PointerEvent) => {
        if (!isMultiTouch) {
          trackerId.current = createPointerTracker(event);
        }
      })
      .on('pointermove.tooltip', (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && !isMultiTouch && trackerId.current === undefined) {
          trackerId.current = createPointerTracker(event);
        }
      });

    return () => {
      anchorD3.on('touchmove.tooltip pointerenter.tooltip pointerdown.tooltip', null);
      trackerId.current && anchorD3.on(
        [ 'pointerup', 'pointercancel', 'lostpointercapture', 'pointermove', 'pointerout' ].map((event) => `${ event }.${ trackerId.current }`).join(' '),
        null,
      );
    };
  }, [ anchorEl, createPointerTracker, draw, hideContent, showContent ]);

  return (
    <g
      ref={ ref }
      opacity={ 0 }
      fontSize="12px"
      fontWeight="500"
      dominantBaseline="hanging"
      { ...props }
    >
      <ChartTooltipLine/>
      { data.map(({ name }) => <ChartTooltipPoint key={ name }/>) }
      <g className="ChartTooltip__content">
        <ChartTooltipBackdrop width={ tooltipWidth } seriesNum={ data.length }/>
        <ChartTooltipTitle/>
        <ChartTooltipRow label="Date" lineNum={ 1 }/>
        { data.map(({ name }, index) => <ChartTooltipRow key={ name } label={ name } lineNum={ index + 1 }/>) }
      </g>
    </g>
  );
};

export default React.memo(ChartTooltip);
