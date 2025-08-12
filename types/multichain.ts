import type config from 'configs/app';

export interface ChainConfig {
  slug: string;
  config: typeof config;
}

export interface MultichainConfig {
  chains: Array<ChainConfig>;
}
