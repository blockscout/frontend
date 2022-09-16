export type AppCategory = {
  id: string;
  name: string;
}

export type AppItemPreview = {
  id: string;
  title: string;
  logo: string;
  shortDescription: string;
  categories: Array<AppCategory>;
}

export type AppItemOverview = AppItemPreview & {
  url: string;
  description: string;
  site: string;
  twitter: string;
  telegram: string;
  github: string;
}
