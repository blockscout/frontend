import type { SankeyNode, SankeyLink } from 'd3-sankey';

export interface SankeyNodeDatum {
  readonly id: string;
  readonly name: string;
}

export interface SankeyLinkDatum {
  readonly source: string;
  readonly target: string;
  readonly value: number;
}

export interface SankeyData {
  readonly nodes: ReadonlyArray<SankeyNodeDatum>;
  readonly links: ReadonlyArray<SankeyLinkDatum>;
}

export type SankeyNodeExtended = SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
export type SankeyLinkExtended = SankeyLink<SankeyNodeDatum, SankeyLinkDatum>;
