import type { Chain } from 'viem';

import type config from 'configs/app';

export interface ChainConfig {
  // TODO @tom2drum make optional
  slug: string;
  // TODO @tom2drum make partial
  // TODO @tom2drum make chain id primary key
  config: typeof config;
  contracts?: Chain['contracts'];
}

export interface MultichainConfig {
  chains: Array<ChainConfig>;
}
