import type { FunctionComponent, SVGAttributes } from 'react';

export type NetworkGroup = 'mainnets' | 'testnets' | 'other';

export interface Network {
  name: string;
  // basePath = /<type>/<subType>, e.g. /xdai/mainnet
  type: string;
  subType: string;
  group: 'mainnets' | 'testnets' | 'other';
  icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  isAccountSupported?: boolean;
}
