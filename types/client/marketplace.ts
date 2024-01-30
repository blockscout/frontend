export type MarketplaceAppPreview = {
  id: string;
  external?: boolean;
  title: string;
  logo: string;
  logoDarkMode?: string;
  shortDescription: string;
  categories: Array<string>;
  url: string;
  internalWallet?: boolean;
  priority?: number;
}

export type MarketplaceAppOverview = MarketplaceAppPreview & {
  author: string;
  description: string;
  site?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
}

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}
