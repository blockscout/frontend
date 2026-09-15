// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';
import type { ChainConfig } from 'src/slices/token/utils/token-types';

import { getUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

// A state change is scaled by the factor in force at its block (ui_multiplier),
// never by the token's current factor (token.ui_multiplier), which may have changed since.
export function getStateChangeUiMultiplier(data: schemas['StateChange'], chainConfig?: ChainConfig): BigNumber | undefined {
  if (data.type !== 'token' || !data.token) {
    return undefined;
  }

  return getUiMultiplier({ type: data.token.type, ui_multiplier: data.ui_multiplier }, chainConfig);
}
