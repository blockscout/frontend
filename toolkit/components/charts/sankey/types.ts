import type { SankeyNode, SankeyLink } from 'd3-sankey';

export interface SankeyNodeDatum {
  id: string;
  name: string;
}

export interface SankeyLinkDatum {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: Array<SankeyNodeDatum>;
  links: Array<SankeyLinkDatum>;
}

export type SankeyNodeExtended = SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
export type SankeyLinkExtended = SankeyLink<SankeyNodeDatum, SankeyLinkDatum>;
