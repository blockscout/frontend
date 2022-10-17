import type { FunctionComponent, SVGAttributes } from 'react';

export type NetworkGroup = 'mainnets' | 'testnets' | 'other';

export interface FeaturedNetwork {
  title: string;
  basePath: string;
  group: NetworkGroup;
  icon?: FunctionComponent<SVGAttributes<SVGElement>> | string;
}

export interface NetworkExplorer {
  title: string;
  baseUrl: string;
  paths: {
    tx: string;
  };
}
