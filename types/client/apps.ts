export enum MarketplaceCategoryId {
  'all',
  'favorites',
  'defi',
  'exchanges',
  'finance',
  'games',
  'marketplaces',
  'nft',
  'security',
  'social',
  'tools',
  'yieldFarming',
}

export type MarketplaceCategoriesIds = keyof typeof MarketplaceCategoryId;

export type MarketplaceCategory = { id: MarketplaceCategoriesIds; name: string }

export type AppItemPreview = {
  id: string;
  title: string;
  logo: string;
  shortDescription: string;
  categories: Array<MarketplaceCategoriesIds>;
}

export type AppItemOverview = AppItemPreview & {
  author: string;
  url: string;
  description: string;
  site?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
}
