export enum MarketplaceCategoryNames {
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

export type AppItemPreview = {
  id: string;
  title: string;
  logo: string;
  shortDescription: string;
  categories: Array<keyof typeof MarketplaceCategoryNames>;
}

export type AppItemOverview = AppItemPreview & {
  chainId: number;
  author: string;
  url: string;
  description: string;
  site?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
}
