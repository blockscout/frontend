import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

interface Props {
  limits: [[number, number], [number, number]];
  anchor: SVGSVGElement | null;
  setRange: (range: [number, number]) => void;
}

export default function useBrushX({ limits, anchor, setRange }: Props) {
  const brushRef = React.useRef<d3.BrushBehavior<unknown>>();
  const [ brushSelectionBg ] = useToken('colors', useColorModeValue('blackAlpha.400', 'whiteAlpha.500'));

  React.useEffect(() => {
    if (!anchor || brushRef.current || limits[1][0] === 0) {
      return;
    }

    const svgEl = d3.select(anchor).select('g');
    brushRef.current = d3.brushX()
      .extent(limits);
    brushRef.current.on('end', (event) => {
      setRange(event.selection);
    });

    const gBrush = svgEl?.append('g')
      .attr('class', 'ChartBrush')
      .call(brushRef.current);

    gBrush.select('.selection')
      .attr('stroke', 'none')
      .attr('fill', brushSelectionBg);

  }, [ anchor, brushSelectionBg, limits, setRange ]);
}
