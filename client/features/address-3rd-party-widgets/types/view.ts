// SPDX-License-Identifier: LicenseRef-Blockscout

export const ADDRESS_3RD_PARTY_WIDGET_PAGES = [ 'eoa', 'contract', 'token' ] as const;

export type Address3rdPartyWidget = {
  name: string;
  url: string;
  icon: string;
  title: string;
  hint?: string;
  valuePath: string;
  valueTitlePath?: string;
  pages: Array<typeof ADDRESS_3RD_PARTY_WIDGET_PAGES[number]>;
  chainIds?: Record<string, string>;
};
