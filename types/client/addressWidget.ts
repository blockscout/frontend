export const ADDRESS_WIDGET_PAGES = [ 'eoa', 'contract', 'token' ] as const;

export type AddressWidget = {
  name: string;
  url: string;
  icon: string;
  title: string;
  hint?: string;
  value: string;
  pages: Array<typeof ADDRESS_WIDGET_PAGES[number]>;
  chainIds?: Record<string, string>;
};
