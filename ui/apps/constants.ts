import type { AppCategory } from 'types/client/apps';

export const APP_CATEGORIES: Array<AppCategory> = [
  {
    id: 'all',
    name: 'All',
    routeName: 'apps',
  },
  {
    id: 'defi',
    name: 'DeFi',
    routeName: 'apps_category_defi',
  },
  {
    id: 'exchanges',
    name: 'Exchanges',
    routeName: 'apps_category_exchanges',
  },
  {
    id: 'finance',
    name: 'Finance',
    routeName: 'apps_category_finance',
  },
  {
    id: 'games',
    name: 'Games',
    routeName: 'apps_category_games',
  },
  {
    id: 'marketplaces',
    name: 'Marketplaces',
    routeName: 'apps_category_marketplaces',
  },
  {
    id: 'nft',
    name: 'NFT',
    routeName: 'apps_category_nft',
  },
  {
    id: 'security',
    name: 'Security',
    routeName: 'apps_category_security',
  },
  {
    id: 'social',
    name: 'Social',
    routeName: 'apps_category_social',
  },
  {
    id: 'tools',
    name: 'Tools',
    routeName: 'apps_category_tools',
  },
  {
    id: 'yield-farming',
    name: 'Yield Farming',
    routeName: 'apps_category_yield_farming',
  },
];
