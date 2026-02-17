import { useToken } from '@chakra-ui/react';
import React from 'react';

import type { ChartMargin } from '../types';
import type { SankeyData, SankeyNodeDatum } from './types';

import {
  DEFAULT_SANKEY_LINK_HOVER_OPACITY,
  DEFAULT_SANKEY_LINK_OPACITY,
  SANKEY_NODE_COLORS,
} from './constants';
import { SankeyLink } from './parts/SankeyLink';
import { SankeyNode } from './parts/SankeyNode';
import { useSankeyController } from './useSankeyController';

export type SankeyLinkColorMode = 'source' | 'target';

export interface SankeyChartProps {
  data: SankeyData;
  margin?: ChartMargin;
  nodeWidth?: number;
  nodePadding?: number;
  linkOpacity?: number;
  linkHoverOpacity?: number;
  linkColorMode?: SankeyLinkColorMode;
  colors?: ReadonlyArray<string>;
  valueFormatter?: (value: number) => string;
}

const DEFAULT_CHART_MARGIN: ChartMargin = { top: 8, right: 0, bottom: 8, left: 0 };

export const SankeyChart = React.memo(({
  data,
  margin: marginProps,
  nodeWidth,
  nodePadding,
  linkOpacity = DEFAULT_SANKEY_LINK_OPACITY,
  linkHoverOpacity = DEFAULT_SANKEY_LINK_HOVER_OPACITY,
  linkColorMode = 'source',
  colors = SANKEY_NODE_COLORS,
  valueFormatter,
}: SankeyChartProps) => {
  const margin: ChartMargin = React.useMemo(() => ({ ...DEFAULT_CHART_MARGIN, ...marginProps }), [ marginProps ]);

  const [ textColor ] = useToken('colors', [ 'text.secondary' ]);
  const [ fontSize ] = useToken('fontSizes', [ 'xs' ]);

  const {
    ref,
    rect,
    innerWidth,
    nodes,
    links,
    linkPathGenerator,
  } = useSankeyController({
    data,
    margin,
    nodeWidth,
    nodePadding,
  });

  const nodeColorMap = React.useMemo(() => {
    const map = new Map<string, string>();
    nodes.forEach((node, index) => {
      map.set((node as SankeyNodeDatum).id, colors[index % colors.length]);
    });
    return map;
  }, [ nodes, colors ]);

  const getNodeColor = React.useCallback((node: SankeyNodeDatum) => {
    return nodeColorMap.get(node.id) || colors[0];
  }, [ nodeColorMap, colors ]);

  const formatValue = React.useCallback((value: number | undefined) => {
    if (value === undefined) {
      return '';
    }
    return valueFormatter ? valueFormatter(value) : String(value);
  }, [ valueFormatter ]);

  return (
    <svg width="100%" height="100%" ref={ ref } opacity={ rect ? 1 : 0 }>
      <g transform={ `translate(${ margin.left || 0 },${ margin.top || 0 })` }>
        { links.map((link, index) => {
          return (
            <SankeyLink
              key={ `link-${ index }` }
              link={ link }
              color={ getNodeColor(linkColorMode === 'target' ? link.target as SankeyNodeDatum : link.source as SankeyNodeDatum) }
              opacity={ linkOpacity }
              hoverOpacity={ linkHoverOpacity }
              pathGenerator={ linkPathGenerator }
            />
          );
        }) }

        { nodes.map((node) => (
          <SankeyNode
            key={ (node as SankeyNodeDatum).id }
            node={ node }
            color={ getNodeColor(node as SankeyNodeDatum) }
          />
        )) }

        { nodes.map((node) => {
          const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
          const isRightHalf = (x0 || 0) > innerWidth / 2;
          const labelX = isRightHalf ? (x0 || 0) - 6 : (x1 || 0) + 6;
          const labelY = ((y0 || 0) + (y1 || 0)) / 2;
          const anchor = isRightHalf ? 'end' : 'start';

          return (
            <text
              key={ `label-${ (node as SankeyNodeDatum).id }` }
              x={ labelX }
              y={ labelY }
              dy="0.35em"
              textAnchor={ anchor }
              fill={ textColor }
              fontSize={ fontSize }
            >
              { `${ (node as SankeyNodeDatum).name }${ node.value !== undefined ? ` (${ formatValue(node.value) })` : '' }` }
            </text>
          );
        }) }
      </g>
    </svg>
  );
});
