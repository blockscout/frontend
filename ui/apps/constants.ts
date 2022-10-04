import type { MarketplaceCategoryNames } from 'types/client/apps';

export const APP_CATEGORIES: {[key in keyof typeof MarketplaceCategoryNames]: string} = {
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
