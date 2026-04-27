import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import React from 'react';

import type { ChartMargin } from '../types';
import type { SankeyChartData, SankeyChartLinkExtended, SankeyChartNodeExtended } from './types';

import { useClientRect } from '../../../hooks/useClientRect';
import { calculateInnerSize } from '../utils/calculateInnerSize';
import { SANKEY_NODE_DEFAULT_PADDING, SANKEY_NODE_DEFAULT_WIDTH } from './constants';

interface Props {
  data: SankeyChartData;
  margin?: ChartMargin;
  nodeWidth?: number;
  nodePadding?: number;
}

interface SankeyLayout {
  nodes: Array<SankeyChartNodeExtended>;
  links: Array<SankeyChartLinkExtended>;
}

interface UseSankeyControllerResult {
  ref: React.Ref<SVGSVGElement> | undefined;
  readonly rect: DOMRect | null;
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly nodes: Array<SankeyChartNodeExtended>;
  readonly links: Array<SankeyChartLinkExtended>;
  readonly linkPathGenerator: (link: SankeyChartLinkExtended) => string | null;
}

export function useSankeyController({ data, margin, nodeWidth, nodePadding }: Props): UseSankeyControllerResult {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();

  const { innerWidth, innerHeight } = calculateInnerSize(rect, margin);

  const layout: SankeyLayout = React.useMemo(() => {
    if (innerWidth <= 0 || innerHeight <= 0) {
      return { nodes: [], links: [] };
    }

    const sankeyGenerator = sankey<SankeyChartData['nodes'][number], SankeyChartData['links'][number]>()
      .nodeId((d) => d.id)
      .nodeWidth(nodeWidth ?? SANKEY_NODE_DEFAULT_WIDTH)
      .nodePadding(nodePadding ?? SANKEY_NODE_DEFAULT_PADDING)
      .nodeAlign(sankeyJustify)
      .extent([ [ 0, 0 ], [ innerWidth, innerHeight ] ]);

    const { nodes, links } = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });

    // After layout, source/target on each link are resolved node objects, not ids.
    return { nodes: nodes as Array<SankeyChartNodeExtended>, links: links as unknown as Array<SankeyChartLinkExtended> };
  }, [ data, innerWidth, innerHeight, nodeWidth, nodePadding ]);

  const linkPathGenerator: (link: SankeyChartLinkExtended) => string | null = React.useMemo(() => sankeyLinkHorizontal(), []);

  return React.useMemo(() => ({
    ref,
    rect,
    innerWidth,
    innerHeight,
    nodes: layout.nodes,
    links: layout.links,
    linkPathGenerator,
  }), [ ref, rect, innerWidth, innerHeight, layout, linkPathGenerator ]);
}
