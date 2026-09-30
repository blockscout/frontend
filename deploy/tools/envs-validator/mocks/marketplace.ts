// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EssentialDappsConfig, MarketplaceTitles } from 'src/features/marketplace/types/client';

export interface MarketplaceAppConfig {
  readonly id: string;
  readonly external?: boolean;
  readonly title: string;
  readonly logo: string;
  readonly logoDarkMode?: string;
  readonly shortDescription: string;
  readonly categories: Array<string>;
  readonly url: string;
  readonly author: string;
  readonly description: string;
  readonly site?: string;
  readonly twitter?: string;
  readonly telegram?: string;
  readonly github?: string | Array<string>;
  readonly discord?: string;
  readonly internalWallet?: boolean;
  readonly priority?: number;
}

export const marketplaceApps: Array<MarketplaceAppConfig> = [
  {
    author: 'Hop',
    id: 'hop-exchange',
    title: 'Hop',
    logo: 'https://example.com/logo.svg',
    categories: [ 'Bridge' ],
    shortDescription: 'Hop is a bridge.',
    site: 'https://example.com',
    description: 'Hop is a bridge.',
    external: true,
    url: 'https://example.com',
  },
  {
    author: 'Blockscout',
    id: 'token-approval-tracker',
    title: 'Token Approval Tracker',
    logo: 'https://example.com/logo.svg',
    categories: [ 'Infra & Dev tooling' ],
    shortDescription: 'Tracks approvals.',
    site: 'https://example.com',
    description: 'Tracks approvals.',
    url: 'https://example.com',
    github: [ 'https://github.com/a', 'https://github.com/b' ],
  },
];

export const marketplaceCategories: Array<string> = [ 'Swaps', 'Bridges', 'NFT' ];

export const essentialDappsConfig: EssentialDappsConfig = {
  swap: { chains: [ '1', '10', '100', '11155111' ], fee: '0.004', integrator: 'blockscout' },
  revoke: { chains: [ '1', '10', '100', '11155111' ] },
  multisend: { chains: [ '1', '10', '100', '11155111' ], posthogKey: '123', posthogHost: 'https://example.com' },
};

export const marketplaceTitles: Partial<MarketplaceTitles> = {
  menu_item: 'Dapps',
  title: 'Dappscout',
};
