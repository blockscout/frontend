import type { TokenType } from 'types/api/tokenInfo';

import type { TokenEnhancedData } from 'ui/address/utils/tokenUtils';

export type FormattedData = Record<TokenType, FormattedDataItem>;

export interface FormattedDataItem {
  items: Array<TokenEnhancedData>;
  isOverflow: boolean;
}
