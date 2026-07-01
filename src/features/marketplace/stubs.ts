/* eslint-disable max-len */
import type { MarketplaceDapp } from '@blockscout/admin-rs-types';

export const MARKETPLACE_APP: MarketplaceDapp = {
  author: 'StubApp Inc.',
  id: 'stub-app',
  title: 'My cool app name',
  logo: '',
  categories: [
    'Bridge',
  ],
  shortDescription: 'Hop is a scalable rollup-to-rollup general token bridge. It allows users to send tokens from one rollup or sidechain to another almost immediately without having to wait for the networks challenge period.',
  site: 'https://example.com',
  description: 'Hop is a scalable rollup-to-rollup general token bridge. It allows users to send tokens from one rollup or sidechain to another almost immediately without having to wait for the networks challenge period.',
  external: true,
  url: 'https://example.com',
  internalWallet: false,
  github: [],
};

export const CATEGORIES: Array<string> = Array(9).fill('Bridge').map((c, i) => c + i);
