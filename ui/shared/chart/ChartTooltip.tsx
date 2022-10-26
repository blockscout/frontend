import { useToken, useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

interface Props {
  width?: number;
  height?: number;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  data: {
    items: Array<TimeChartItem>;
  };
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  anchorEl: SVGRectElement | null;
}

const ChartTooltip = ({ xScale, yScale, width, height, data, margin: _margin, anchorEl, ...props }: Props) => {
  const margin = React.useMemo(() => ({
    top: 0, bottom: 0, left: 0, right: 0,
    ..._margin,
  }), [ _margin ]);

  const lineColor = useToken('colors', 'red.500');
  const textColor = useToken('colors', useColorModeValue('white', 'black'));
  const bgColor = useToken('colors', useColorModeValue('gray.900', 'gray.400'));

  const ref = React.useRef(null);

  const drawLine = React.useCallback(
    (x: number) => {
      d3.select(ref.current)
        .select('.ChartTooltip__line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', -margin.top)
        .attr('y2', height || 0);
    },
    [ ref, height, margin ],
  );

  const drawContent = React.useCallback(
    (x: number) => {
      const tooltipContent = d3.select(ref.current).select('.ChartTooltip__content');

      tooltipContent.attr('transform', (cur, i, nodes) => {
        const OFFSET = 8;
        const node = nodes[i] as SVGGElement | null;
        const nodeWidth = node?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x + OFFSET > (width || 0) ? x - nodeWidth - OFFSET : x + OFFSET;
        return `translate(${ translateX }, ${ -margin.top })`;
      });

      tooltipContent
        .select('.ChartTooltip__contentTitle')
        .text(d3.timeFormat('%b %d, %Y')(xScale.invert(x)));
    },
    [ xScale, margin, width ],
  );

  const onChangePosition = React.useCallback((d: TimeChartItem, isVisible: boolean) => {
    d3.select('.ChartTooltip__value')
      .text(isVisible ? d.value.toLocaleString() : '');
  }, []);

  const followPoints = React.useCallback((event: MouseEvent) => {
    const [ x ] = d3.pointer(event, anchorEl);
    const xDate = xScale.invert(x);
    const bisectDate = d3.bisector<TimeChartItem, unknown>((d) => d.date).left;
    let baseXPos = 0;

    // draw circles on line
    d3.select(ref.current)
      .select('.ChartTooltip__linePoint')
      .attr('transform', (cur, i) => {
        const index = bisectDate(data.items, xDate, 1);
        const d0 = data.items[index - 1];
        const d1 = data.items[index];
        const d = xDate.getTime() - d0?.date.getTime() > d1?.date.getTime() - xDate.getTime() ? d1 : d0;

        if (d.date === undefined && d.value === undefined) {
          // move point out of container
          return 'translate(-100,-100)';
        }

        const xPos = xScale(d.date);
        if (i === 0) {
          baseXPos = xPos;
        }

        let isVisible = true;
        if (xPos !== baseXPos) {
          isVisible = false;
        }
        const yPos = yScale(d.value);

        onChangePosition(d, isVisible);

        return isVisible ?
          `translate(${ xPos }, ${ yPos })` :
          'translate(-100,-100)';
      });

    drawLine(baseXPos);
    drawContent(baseXPos);
  }, [
    anchorEl,
    drawLine,
    drawContent,
    xScale,
    yScale,
    data,
    onChangePosition,
  ]);

  React.useEffect(() => {
    d3.select(anchorEl)
      .on('mouseout.tooltip', () => {
        d3.select(ref.current).attr('opacity', 0);
      })
      .on('mouseover.tooltip', () => {
        d3.select(ref.current).attr('opacity', 1);
      })
      .on('mousemove.tooltip', (event: MouseEvent) => {
        d3.select(ref.current)
          .select('.ChartTooltip__linePoint')
          .attr('opacity', 1);
        followPoints(event);
      });
  }, [ anchorEl, followPoints ]);

  return (
    <g ref={ ref } opacity={ 0 } { ...props }>
      <line className="ChartTooltip__line" stroke={ lineColor }/>
      <g className="ChartTooltip__content">
        <rect className="ChartTooltip__contentBg" rx={ 8 } ry={ 8 } fill={ bgColor } width={ 125 } height={ 52 }/>
        <text className="ChartTooltip__contentTitle" transform="translate(8,20)" fontSize="12px" fontWeight="bold" fill={ textColor }/>
        <text
          transform="translate(8,40)"
          className="ChartTooltip__value"
          fontSize="12px"
          fill={ textColor }
        />
      </g>
      <circle className="ChartTooltip__linePoint" r={ 3 } opacity={ 0 } fill={ lineColor }/>
    </g>
  );
};

export default React.memo(ChartTooltip);
