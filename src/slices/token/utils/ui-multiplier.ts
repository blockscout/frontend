// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';
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

export function isTokenMultiplierEnabled(chainConfig?: ChainConfig) {
  return getAdditionalTokenTypes(chainConfig).some((item) => item.id === UI_MULTIPLIER_TOKEN_TYPE);
}

export function getUiMultiplier(token: UiMultiplierSource | null | undefined, chainConfig?: ChainConfig): BigNumber | undefined {
  if (!token || token.type !== UI_MULTIPLIER_TOKEN_TYPE || !token.ui_multiplier) {
    return undefined;
  }

  if (!isTokenMultiplierEnabled(chainConfig)) {
    return undefined;
  }

  const multiplier = parseUiMultiplier(token.ui_multiplier);
  return multiplier.isNaN() ? undefined : multiplier;
}

export function parseUiMultiplier(rawValue: string): BigNumber {
  return new BigNumber(rawValue).shiftedBy(-UI_MULTIPLIER_DECIMALS);
}

export function formatUiMultiplier(value: BigNumber, postfix = 'x'): string {
  return formatBnValue({ value, accuracy: UI_MULTIPLIER_ACCURACY, postfix });
}

export type UiMultiplierChangeStatus = 'active' | 'inactive' | 'scheduled';

type UiMultiplierChange = Pick<schemas['TokenUIMultiplierChange'], 'effective_at'>;

function isScheduled(item: UiMultiplierChange, now: number): boolean {
  return new Date(item.effective_at).getTime() > now;
}

export function getUiMultiplierChangeStatuses(
  items: Array<UiMultiplierChange>,
  page: number,
  now: number = Date.now(),
): Array<UiMultiplierChangeStatus> {
  const activeIndex = page === 1 ? items.findIndex((item) => !isScheduled(item, now)) : -1;
  return items.map((item, index) => {
    if (isScheduled(item, now)) {
      return 'scheduled';
    }
    return index === activeIndex ? 'active' : 'inactive';
  });
}
