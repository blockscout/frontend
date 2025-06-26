export type CustomLink = {
  text: string;
  url: string;
  iconUrl?: [ string, string ];
};

export type CustomLinksGroup = {
  title: string;
  links: Array<CustomLink>;
};
