import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

import dayjs from 'lib/date/dayjs';

const SELECTION_THRESHOLD = 2;

interface Props {
  height: number;
  anchorEl?: SVGRectElement | null;
  scale: d3.ScaleTime<number, number>;
  data: TimeChartData;
  onSelect: (range: [Date, Date]) => void;
}

const ChartSelectionX = ({ anchorEl, height, scale, data, onSelect }: Props) => {
  const [ borderColor ] = useToken('colors', 'blue.200');

  const ref = React.useRef(null);
  const isActive = React.useRef(false);
  const startX = React.useRef<number>();
  const endX = React.useRef<number>();

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

  const handleSelect = React.useCallback((x0: number, x1: number) => {
    const startDate = scale.invert(x0);
    const endDate = scale.invert(x1);

    if (Math.abs(dayjs(startDate).diff(endDate, 'day')) > SELECTION_THRESHOLD) {
      onSelect([ dayjs.min(dayjs(startDate), dayjs(endDate)).toDate(), dayjs.max(dayjs(startDate), dayjs(endDate)).toDate() ]);
    }
  }, [ onSelect, scale ]);

  const cleanUp = React.useCallback(() => {
    isActive.current = false;
    startX.current = undefined;
    endX.current = undefined;
    d3.select(ref.current).attr('opacity', 0);
  }, [ ]);

  const handelMouseUp = React.useCallback(() => {
    if (!isActive.current) {
      return;
    }

    if (startX.current && endX.current) {
      handleSelect(startX.current, endX.current);
    }

    cleanUp();
  }, [ cleanUp, handleSelect ]);

  React.useEffect(() => {
    if (!anchorEl) {
      return;
    }

    const anchorD3 = d3.select(anchorEl);

    anchorD3
      .on('mousedown.selectionX', (event: MouseEvent) => {
        const [ x ] = d3.pointer(event, anchorEl);
        isActive.current = true;
        startX.current = x;
      })
      .on('mousemove.selectionX', (event: MouseEvent) => {
        if (isActive.current) {
          const [ x ] = d3.pointer(event, anchorEl);
          startX.current && drawSelection(startX.current, x);
          endX.current = x;
        }
      })
      .on('mouseup.selectionX', handelMouseUp)
      .on('touchstart.selectionX', (event: TouchEvent) => {
        const pointers = d3.pointers(event, anchorEl);
        isActive.current = pointers.length === 2;
      })
      .on('touchmove.selectionX', (event: TouchEvent) => {
        if (isActive.current) {
          const pointers = d3.pointers(event, anchorEl);

          if (pointers.length === 2 && Math.abs(pointers[0][0] - pointers[1][0]) > 5) {
            drawSelection(pointers[0][0], pointers[1][0]);

            startX.current = pointers[0][0];
            endX.current = pointers[1][0];
          }
        }
      })
      .on('touchend.selectionX', handelMouseUp);

    d3.select('body').on('mouseup.selectionX', function(event) {
      const isOutside = startX.current !== undefined && event.target !== anchorD3.node();
      if (isOutside) {
        handelMouseUp();
      }
    });

    return () => {
      anchorD3.on('.selectionX', null);
      d3.select('body').on('.selectionX', null);
    };
  }, [ anchorEl, cleanUp, drawSelection, getIndexByX, handelMouseUp, handleSelect ]);

  return (
    <g className="ChartSelectionX" ref={ ref } opacity={ 0 }>
      <rect className="ChartSelectionX__rect" width={ 0 } height={ height } fill="rgba(66, 153, 225, 0.1)"/>
      <line className="ChartSelectionX__line ChartSelectionX__line_left" x1={ 0 } x2={ 0 } y1={ 0 } y2={ height } stroke={ borderColor }/>
      <line className="ChartSelectionX__line ChartSelectionX__line_right" x1={ 0 } x2={ 0 } y1={ 0 } y2={ height } stroke={ borderColor }/>
    </g>
  );
};

export default React.memo(ChartSelectionX);
