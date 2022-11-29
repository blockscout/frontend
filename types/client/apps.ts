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
  external: boolean;
  title: string;
  logo: string;
  shortDescription: string;
  categories: Array<MarketplaceCategoriesIds>;
  url: string;
}

export type AppItemOverview = AppItemPreview & {
  author: string;
  description: string;
  site?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
}
