import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

const SELECTION_THRESHOLD = 1;

interface Props {
  height: number;
  anchorEl?: SVGRectElement | null;
  scale: d3.ScaleTime<number, number>;
  data: TimeChartData;
  onSelect: (range: [number, number]) => void;
}

const ChartSelectionX = ({ anchorEl, height, scale, data, onSelect }: Props) => {
  const borderColor = useToken('colors', 'blue.200');

  const ref = React.useRef(null);
  const isPressed = React.useRef(false);
  const startX = React.useRef<number>();
  const endX = React.useRef<number>();
  const startIndex = React.useRef<number>(0);

  const getIndexByX = React.useCallback((x: number) => {
    const xDate = scale.invert(x);
    const bisectDate = d3.bisector<TimeChartItem, unknown>((d) => d.date).left;
    return bisectDate(data[0].items, xDate, 1);
  }, [ data, scale ]);

  const drawSelection = React.useCallback((x0: number, x1: number) => {
    const diffX = x1 - x0;

    d3.select(ref.current)
      .attr('opacity', 1);

    d3.select(ref.current)
      .select('.ChartSelectionX__line_left')
      .attr('x1', x0)
      .attr('x2', x0);

    d3.select(ref.current)
      .select('.ChartSelectionX__line_right')
      .attr('x1', x1)
      .attr('x2', x1);

    d3.select(ref.current)
      .select('.ChartSelectionX__rect')
      .attr('x', diffX > 0 ? x0 : diffX + x0)
      .attr('width', Math.abs(diffX));
  }, []);

  const handelMouseUp = React.useCallback(() => {
    isPressed.current = false;
    startX.current = undefined;
    d3.select(ref.current).attr('opacity', 0);

    if (!endX.current) {
      return;
    }

    const index = getIndexByX(endX.current);
    if (Math.abs(index - startIndex.current) > SELECTION_THRESHOLD) {
      onSelect([ Math.min(index, startIndex.current), Math.max(index, startIndex.current) ]);
    }
  }, [ getIndexByX, onSelect ]);

  React.useEffect(() => {
    if (!anchorEl) {
      return;
    }

    const anchorD3 = d3.select(anchorEl);

    anchorD3
      .on('mousedown.selectionX', (event: MouseEvent) => {
        const [ x ] = d3.pointer(event, anchorEl);
        isPressed.current = true;
        startX.current = x;

        const index = getIndexByX(x);
        startIndex.current = index;
      })
      .on('mouseup.selectionX', handelMouseUp)
      .on('mousemove.selectionX', (event: MouseEvent) => {
        if (isPressed.current) {
          const [ x ] = d3.pointer(event, anchorEl);
          startX.current && drawSelection(startX.current, x);
          endX.current = x;
        }
      });

    d3.select('body').on('mouseup.selectionX', function(event) {
      const isOutside = startX.current !== undefined && event.target !== anchorD3.node();
      if (isOutside) {
        handelMouseUp();
      }
    });

    return () => {
      anchorD3.on('mousedown.selectionX mouseup.selectionX mousemove.selectionX', null);
      d3.select('body').on('mouseup.selectionX', null);
    };
  }, [ anchorEl, drawSelection, getIndexByX, handelMouseUp ]);

  return (
    <g className="ChartSelectionX" ref={ ref } opacity={ 0 }>
      <rect className="ChartSelectionX__rect" width={ 0 } height={ height } fill="rgba(66, 153, 225, 0.1)"/>
      <line className="ChartSelectionX__line ChartSelectionX__line_left" x1={ 0 } x2={ 0 } y1={ 0 } y2={ height } stroke={ borderColor }/>
      <line className="ChartSelectionX__line ChartSelectionX__line_right" x1={ 0 } x2={ 0 } y1={ 0 } y2={ height } stroke={ borderColor }/>
    </g>
  );
};

export default React.memo(ChartSelectionX);
