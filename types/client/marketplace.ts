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

export type MarketplaceAppSocialInfo = {
  twitter?: string;
  telegram?: string;
  github?: string | Array<string>;
  discord?: string;
}

export type MarketplaceAppOverview = MarketplaceAppPreview & MarketplaceAppSocialInfo & {
  author: string;
  description: string;
  site?: string;
}

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}
