import type config from 'configs/app';

export interface SubchainConfig {
  slug: string;
  config: typeof config;
}

export interface MultichainConfig {
  chains: Array<SubchainConfig>;
}
