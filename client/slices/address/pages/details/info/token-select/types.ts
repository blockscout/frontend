import type { TokenEnhancedData } from 'client/slices/address/pages/details/tokens/token-utils';

export type FormattedData = Record<string, FormattedDataItem>;

export interface FormattedDataItem {
  items: Array<TokenEnhancedData>;
  isOverflow: boolean;
}
