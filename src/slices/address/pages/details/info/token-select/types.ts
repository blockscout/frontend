// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenEnhancedData } from 'src/slices/token/pages/address/utils';

export type FormattedData = Record<string, FormattedDataItem>;

export interface FormattedDataItem {
  items: Array<TokenEnhancedData>;
  isOverflow: boolean;
}
