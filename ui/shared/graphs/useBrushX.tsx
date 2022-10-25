import { useToken, useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

interface Props {
  limits: [[number, number], [number, number]];
  anchor: SVGSVGElement | null;
}

export default function useBrushX({ limits, anchor }: Props) {
  const brushRef = React.useRef<d3.BrushBehavior<unknown>>();
  const [ range, setRange ] = React.useState<[number, number]>([ 0, Infinity ]);
  const brushSelectionBg = useToken('colors', useColorModeValue('blackAlpha.400', 'whiteAlpha.500'));

  React.useEffect(() => {
    if (!anchor || brushRef.current) {
      return;
    }

    const svgEl = d3.select(anchor).select('g');
    brushRef.current = d3.brushX()
      .extent(limits);
    brushRef.current.on('end', (event) => {
      setRange(event.selection);
    });

    const gBrush = svgEl?.append('g')
      .attr('class', 'brush')
      .call(brushRef.current);

    gBrush.select('.selection')
      .attr('stroke', 'none')
      .attr('fill', brushSelectionBg);

  }, [ anchor, brushSelectionBg, limits ]);

  return range;
}
