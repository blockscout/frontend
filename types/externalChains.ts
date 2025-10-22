import type { Chain } from 'viem';

import type config from 'configs/app';

export interface ExternalChain {
  // required fields
  id: string;
  name: string;
  logo: string | undefined;
  explorer_url: string;

  // optional fields
  app_config?: typeof config;
  contracts?: Chain['contracts'];
}
