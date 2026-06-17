// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { AddressTokenItem } from 'src/features/multichain/types/client';
import { isFungibleTokenType } from 'src/slices/token/utils/token-types';

import { hairsp } from 'src/toolkit/utils/htmlEntities';

export function formatPercentage(percentage: number) {
  const value = Math.round(percentage * 100);
  if (value === 0 && percentage > 0) {
    return `<${ hairsp }1%`;
  }
  if (value === 100 && percentage < 1) {
    return `>${ hairsp }99%`;
  }
  return `${ value }%`;
}

export const calculateUsdValue = (data: AddressTokenItem) => {
  const isFungibleToken = isFungibleTokenType(data.token?.type);

  if (!isFungibleToken) {
    return;
  }

  const exchangeRate = data.token?.exchange_rate;
  if (!exchangeRate) {
    return;
  }

  const decimals = Number(data.token?.decimals || '18');
  return {
    usd: BigNumber(data.value ?? '0').div(BigNumber(10 ** decimals)).multipliedBy(BigNumber(exchangeRate)),
  };
};
