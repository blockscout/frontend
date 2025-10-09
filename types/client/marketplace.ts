export type MarketplaceAppBase = {
  id: string;
  author: string;
  site?: string;
  external?: boolean;
  title: string;
  description: string;
  logo: string;
  logoDarkMode?: string;
  shortDescription: string;
  categories: Array<string>;
  url: string;
  internalWallet?: boolean;
  priority?: number;
};

export type MarketplaceAppRating = {
  rating?: number;
  ratingsTotalCount?: number;
  userRating?: number;
};

export type MarketplaceAppSocialInfo = {
  twitter?: string;
  telegram?: string;
  github?: string | Array<string>;
  discord?: string;
};

export type MarketplaceApp = MarketplaceAppBase & MarketplaceAppSocialInfo & MarketplaceAppRating;

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}

export type EssentialDappsConfig = {
  swap?: {
    chains: Array<string>;
    fee: string;
    integrator: string;
  };
  revoke?: {
    chains: Array<string>;
  };
  multisend?: {
    chains: Array<string>;
    posthogKey?: string;
    posthogHost?: string;
  };
};
