// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { TokenType } from 'src/slices/token/types/api';
import type { ChainConfig } from 'src/slices/token/utils/token-types';
import { getAdditionalTokenTypes } from 'src/slices/token/utils/token-types';

import { formatBnValue } from 'src/shared/values/entity/utils';

export const UI_MULTIPLIER_TOKEN_TYPE = 'ERC-8056';

// Fixed by ERC-8056 itself: uiMultiplier() is a uint256 where 1e18 means 1.0, regardless of the token's own decimals.
const UI_MULTIPLIER_DECIMALS = 18;
const UI_MULTIPLIER_ACCURACY = 6;

export interface UiMultiplierSource {
  type: TokenType | null | undefined;
  ui_multiplier: string | null | undefined;
}

export function getUiMultiplier(token: UiMultiplierSource | null | undefined, chainConfig?: ChainConfig): BigNumber | undefined {
  if (!token || token.type !== UI_MULTIPLIER_TOKEN_TYPE || !token.ui_multiplier) {
    return undefined;
  }

  const isTypeEnabled = getAdditionalTokenTypes(chainConfig).some((item) => item.id === UI_MULTIPLIER_TOKEN_TYPE);
  if (!isTypeEnabled) {
    return undefined;
  }

  const multiplier = new BigNumber(token.ui_multiplier).shiftedBy(-UI_MULTIPLIER_DECIMALS);
  return multiplier.isNaN() ? undefined : multiplier;
}

export function formatUiMultiplier(value: BigNumber, postfix = 'x'): string {
  return formatBnValue({ value, accuracy: UI_MULTIPLIER_ACCURACY, postfix });
}
