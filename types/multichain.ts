import type config from 'configs/app';

export interface ChainConfig {
  // TODO @tom2drum make optional
  slug: string;
  // TODO @tom2drum make partial
  config: typeof config;
}

export interface MultichainConfig {
  chains: Array<ChainConfig>;
}
