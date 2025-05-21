import type { Apis } from 'configs/app/apis';

export interface SubchainConfig {
  id: string;
  name: string;
  explorer: {
    url: string;
  };
  icon: string;
  apis: Apis;
}

export interface MultichainConfig {
  chains: Array<SubchainConfig>;
}
