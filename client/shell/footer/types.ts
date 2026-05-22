// SPDX-License-Identifier: LicenseRef-Blockscout

export type CustomLink = {
  text: string;
  url: string;
  iconUrl?: Array<string>;
};

export type CustomLinksGroup = {
  title: string;
  links: Array<CustomLink>;
};
