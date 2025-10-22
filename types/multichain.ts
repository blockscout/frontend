import type { Chain } from 'viem';

import type config from 'configs/app';

export interface ChainConfig {
// required fields
  id: string;
  name: string;
  logo: string | undefined;
  explorer_url: string;
  // TODO @tom2drum make optional
  slug: string;

  // optional fields
  app_config?: typeof config;
  contracts?: Chain['contracts'];

  // TODO @tom2drum make partial
  // TODO @tom2drum remove this field
  config: typeof config;
  // contracts?: Chain['contracts'];
}

// TODO @tom2drum refactor this
// config.chain.id

export interface MultichainConfig {
  chains: Array<ChainConfig>;
}
