import type { MarketplaceCategoriesIds } from 'types/client/apps';

export const APP_CATEGORIES: {[key in MarketplaceCategoriesIds]: string} = {
  all: 'All',
  favorites: 'Favorites',
  defi: 'DeFi',
  exchanges: 'Exchanges',
  finance: 'Finance',
  games: 'Games',
  marketplaces: 'Marketplaces',
  nft: 'NFT',
  security: 'Security',
  social: 'Social',
  tools: 'Tools',
  yieldFarming: 'Yield farming',
};
