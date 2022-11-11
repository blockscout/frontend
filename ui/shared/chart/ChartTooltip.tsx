import { useToken, useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartItem, ChartMargin, TimeChartData } from 'ui/shared/chart/types';

interface Props {
  width?: number;
  height?: number;
  margin?: ChartMargin;
  data: TimeChartData;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  anchorEl: SVGRectElement | null;
}

const TEXT_LINE_HEIGHT = 12;
const PADDING = 16;
const LINE_SPACE = 10;

const ChartTooltip = ({ xScale, yScale, width, height, data, margin: _margin, anchorEl, ...props }: Props) => {
  const margin = React.useMemo(() => ({
    top: 0, bottom: 0, left: 0, right: 0,
    ..._margin,
  }), [ _margin ]);

  const lineColor = useToken('colors', 'gray.400');
  const titleColor = useToken('colors', 'blue.100');
  const textColor = useToken('colors', 'white');
  const markerBgColor = useToken('colors', useColorModeValue('black', 'white'));
  const markerBorderColor = useToken('colors', useColorModeValue('white', 'black'));
  const bgColor = useToken('colors', 'blackAlpha.900');

  const ref = React.useRef(null);
  const isPressed = React.useRef(false);

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

  const drawContent = React.useCallback(
    (x: number) => {
      const tooltipContent = d3.select(ref.current).select('.ChartTooltip__content');

      tooltipContent.attr('transform', (cur, i, nodes) => {
        const OFFSET = 8;
        const node = nodes[i] as SVGGElement | null;
        const nodeWidth = node?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x + OFFSET > (width || 0) ? x - nodeWidth - OFFSET : x + OFFSET;
        return `translate(${ translateX }, ${ margin.top + 30 })`;
      });

      tooltipContent
        .select('.ChartTooltip__contentDate')
        .text(d3.timeFormat('%e %b %Y')(xScale.invert(x)));
    },
    [ xScale, margin, width ],
  );

  const updateDisplayedValue = React.useCallback((d: TimeChartItem, i: number) => {
    d3.selectAll('.ChartTooltip__value')
      .filter((td, tIndex) => tIndex === i)
      .text(data[i].valueFormatter?.(d.value) || d.value.toLocaleString());
  }, [ data ]);

  const drawCircles = React.useCallback((event: MouseEvent) => {
    const [ x ] = d3.pointer(event, anchorEl);
    const xDate = xScale.invert(x);
    const bisectDate = d3.bisector<TimeChartItem, unknown>((d) => d.date).left;
    let baseXPos = 0;

    d3.select(ref.current)
      .selectAll('.ChartTooltip__linePoint')
      .attr('transform', (cur, i) => {
        const index = bisectDate(data[i].items, xDate, 1);
        const d0 = data[i].items[index - 1];
        const d1 = data[i].items[index];
        const d = xDate.getTime() - d0?.date.getTime() > d1?.date.getTime() - xDate.getTime() ? d1 : d0;

        if (d.date === undefined && d.value === undefined) {
          // move point out of container
          return 'translate(-100,-100)';
        }

        const xPos = xScale(d.date);
        if (i === 0) {
          baseXPos = xPos;
        }

        const yPos = yScale(d.value);

        updateDisplayedValue(d, i);

        return `translate(${ xPos }, ${ yPos })`;
      });

    return baseXPos;
  }, [ anchorEl, data, updateDisplayedValue, xScale, yScale ]);

  const followPoints = React.useCallback((event: MouseEvent) => {
    const baseXPos = drawCircles(event);
    drawLine(baseXPos);
    drawContent(baseXPos);
  }, [ drawCircles, drawLine, drawContent ]);

  React.useEffect(() => {
    const anchorD3 = d3.select(anchorEl);

    anchorD3
      .on('mousedown.tooltip', () => {
        isPressed.current = true;
        d3.select(ref.current).attr('opacity', 0);
      })
      .on('mouseup.tooltip', () => {
        isPressed.current = false;
      })
      .on('mouseout.tooltip', () => {
        d3.select(ref.current).attr('opacity', 0);
      })
      .on('mouseover.tooltip', () => {
        d3.select(ref.current).attr('opacity', 1);
      })
      .on('mousemove.tooltip', (event: MouseEvent) => {
        if (!isPressed.current) {
          d3.select(ref.current).attr('opacity', 1);
          d3.select(ref.current)
            .selectAll('.ChartTooltip__linePoint')
            .attr('opacity', 1);
          followPoints(event);
        }
      });

    d3.select('body').on('mouseup.tooltip', function(event) {
      const isOutside = event.target !== anchorD3.node();
      if (isOutside) {
        isPressed.current = false;
      }
    });

    return () => {
      anchorD3.on('mousedown.tooltip mouseup.tooltip mouseout.tooltip mouseover.tooltip mousemove.tooltip', null);
      d3.select('body').on('mouseup.tooltip', null);
    };
  }, [ anchorEl, followPoints ]);

  return (
    <g ref={ ref } opacity={ 0 } { ...props }>
      <line className="ChartTooltip__line" stroke={ lineColor } strokeDasharray="3"/>
      <g className="ChartTooltip__content">
        <rect
          className="ChartTooltip__contentBg"
          rx={ 12 }
          ry={ 12 }
          fill={ bgColor }
          width={ 200 }
          height={ 2 * PADDING + (data.length + 1) * TEXT_LINE_HEIGHT + data.length * LINE_SPACE }
        />
        <g transform={ `translate(${ PADDING },${ PADDING })` }>
          <text
            className="ChartTooltip__contentTitle"
            transform="translate(0,0)"
            fontSize="12px"
            fontWeight="500"
            fill={ titleColor }
            dominantBaseline="hanging"
          >
            Date
          </text>
          <text
            className="ChartTooltip__contentDate"
            transform="translate(80,0)"
            fontSize="12px"
            fontWeight="500"
            fill={ textColor }
            dominantBaseline="hanging"
          />
        </g>
        { data.map(({ name }, index) => (
          <g
            key={ name }
            transform={ `translate(${ PADDING },${ PADDING + (index + 1) * (LINE_SPACE + TEXT_LINE_HEIGHT) })` }
          >
            <text
              className="ChartTooltip__contentTitle"
              transform="translate(0,0)"
              fontSize="12px"
              fontWeight="500"
              fill={ titleColor }
              dominantBaseline="hanging"
            >
              { name }
            </text>
            <text
              transform="translate(80,0)"
              className="ChartTooltip__value"
              fontSize="12px"
              fill={ textColor }
              dominantBaseline="hanging"
            />
          </g>
        )) }
      </g>
      { data.map(({ name }) => (
        <circle
          key={ name }
          className="ChartTooltip__linePoint"
          r={ 8 }
          opacity={ 0 }
          fill={ markerBgColor }
          stroke={ markerBorderColor }
          strokeWidth={ 4
          }
        />
      )) }
    </g>
  );
};

export default React.memo(ChartTooltip);
