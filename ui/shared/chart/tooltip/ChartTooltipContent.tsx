import * as d3 from 'd3';
import React from 'react';

import computeTooltipPosition from './computeTooltipPosition';
import { POINT_SIZE } from './utils';

interface Props {
  children: React.ReactNode;
}

const ChartTooltipContent = ({ children }: Props) => {
  return <g className="ChartTooltip__content">{ children }</g>;
};

export default React.memo(ChartTooltipContent);

interface UseRenderContentParams {
  chart: {
    width?: number;
    height?: number;
  };
}

export function useRenderContent(ref: React.RefObject<SVGGElement>, { chart }: UseRenderContentParams) {
  return React.useCallback((x: number, y: number) => {
    const tooltipContent = d3.select(ref.current).select('.ChartTooltip__content');

    tooltipContent.attr('transform', (cur, i, nodes) => {
      const node = nodes[i] as SVGGElement | null;
      const { width: nodeWidth, height: nodeHeight } = node?.getBoundingClientRect() || { width: 0, height: 0 };
      const [ translateX, translateY ] = computeTooltipPosition({
        canvasWidth: chart.width || 0,
        canvasHeight: chart.height || 0,
        nodeWidth,
        nodeHeight,
        pointX: x,
        pointY: y,
        offset: POINT_SIZE,
      });
      return `translate(${ translateX }, ${ translateY })`;
    });
  }, [ chart.height, chart.width, ref ]);
}
