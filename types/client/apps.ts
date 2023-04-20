export type AppItemPreview = {
  id: string;
  external?: boolean;
  title: string;
  logo: string;
  shortDescription: string;
  categories: Array<string>;
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

export enum AppCategory {
  ALL = 'All apps',
  FAVORITES = 'Favorites',
}
