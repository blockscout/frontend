// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenType } from 'src/slices/token/types/api';

export interface TokenTransferFilters {
  type: Array<TokenType>;
}
