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

export type MarketplaceAppWithSecurityReport = MarketplaceAppOverview & {
  securityReport: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}

export enum ContractListTypes {
  ANALYZED = 'Analyzed',
  ALL = 'All',
  VERIFIED = 'Verified',
}
