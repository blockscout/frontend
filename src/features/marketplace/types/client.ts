// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Chain } from 'viem';

import type { ExternalChain } from 'src/shared/external-chains/types';

import type config from 'src/config';

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}

export interface EssentialDappsChainConfig extends ExternalChain {
  app_config?: Pick<typeof config, 'app' | 'chain'> & {
    apis: Pick<typeof config['apis'], 'core'>;
  };
  contracts?: Chain['contracts'];
}

export type EssentialDappsConfig = {
  swap?: {
    url: string;
    chains: Array<string>;
    fee: string;
    integrator: string;
  };
  revoke?: {
    chains: Array<string>;
  };
  multisend?: {
    chains: Array<string>;
    posthogKey?: string;
    posthogHost?: string;
  };
};

export interface MarketplaceTitles {
  entity_name: string;
  menu_item: string;
  title: string;
  subtitle_essential_dapps: string;
  subtitle_list: string;
}
