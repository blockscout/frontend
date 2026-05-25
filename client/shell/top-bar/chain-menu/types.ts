// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FunctionComponent, SVGAttributes } from 'react';

export interface NetworkLink {
  pathname: string;
  name: string;
  icon?: FunctionComponent<SVGAttributes<SVGElement>>;
}

export const NETWORK_GROUPS = [ 'Mainnets', 'Testnets', 'Other' ] as const;
export type NetworkGroup = (typeof NETWORK_GROUPS)[number];

export interface FeaturedNetwork {
  title: string;
  url: string;
  group: NetworkGroup;
  icon?: string;
  isActive?: boolean;
  invertIconInDarkMode?: boolean;
}
