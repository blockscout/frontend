// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import formatCurrencyValue from 'src/features/tx-interpretation/common/utils/format-currency-value';

export const formatTransferAmount = (amount: string): string => {
  return BigNumber(amount).isZero() ? '0' : formatCurrencyValue(amount);
};
