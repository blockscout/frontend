// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';
import type { ChainConfig } from 'src/slices/token/utils/token-types';

import { getUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

type TransferLike = Pick<schemas['TokenTransfer'] | schemas['AdvancedFilterItem'], 'token' | 'total'>;

// A transfer is scaled by the factor in force when it happened (total.ui_multiplier),
// never by the token's current factor (token.ui_multiplier), which may have changed since.
export function getTokenTransferUiMultiplier(data: TransferLike, chainConfig?: ChainConfig): BigNumber | undefined {
  if (!data.token || !data.total || !('ui_multiplier' in data.total)) {
    return undefined;
  }

  return getUiMultiplier({ type: data.token.type, ui_multiplier: data.total.ui_multiplier }, chainConfig);
}
