import type { FunctionComponent, SVGAttributes } from 'react';

export type NetworkGroup = 'mainnets' | 'testnets' | 'other';

export type PreDefinedNetwork =
  | 'xdai_mainnet'
  | 'eth_mainnet'
  | 'etc_mainnet'
  | 'poa_core'
  | 'rsk_mainnet'
  | 'xdai_testnet'
  | 'poa_sokol'
  | 'artis_sigma1'
  | 'lukso_l14'
  | 'astar'
  | 'shiden'
  | 'shibuya'
  | 'optimism'
  | 'goerli'
  | 'base_goerli'
  | 'zetachain'
  | 'li-fi'
  | 'gnosis'
  | 'rootstock'
  | 'tombscout'
  ;

export interface FeaturedNetwork {
  title: string;
  url: string;
  group: NetworkGroup;
  icon?: FunctionComponent<SVGAttributes<SVGElement>> | string;
  type?: PreDefinedNetwork;
  isActive?: boolean;
}

export interface NetworkExplorer {
  title: string;
  baseUrl: string;
  paths: {
    tx?: string;
    address?: string;
  };
}

export type NetworkVerificationType = 'mining' | 'validation';
