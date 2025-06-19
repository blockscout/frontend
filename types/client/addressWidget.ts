export type AddressWidget = {
  name: string;
  url: string;
  icon: string;
  title: string;
  hint?: string;
  value: string;
  chainIds?: Record<string, string>;
};
