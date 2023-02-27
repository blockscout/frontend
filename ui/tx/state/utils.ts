import BigNumber from 'bignumber.js';

import type { TxStateChange } from 'types/api/txStateChanges';

import appConfig from 'configs/app/config';

export function formatData(data: TxStateChange) {
  if (data.type === 'coin') {
    const beforeBn = BigNumber(data.balance_before || '0').div(10 ** appConfig.network.currency.decimals);
    const afterBn = BigNumber(data.balance_after || '0').div(10 ** appConfig.network.currency.decimals);
    const differenceBn = afterBn.minus(beforeBn);

    return {
      balanceBefore: beforeBn.toFormat(),
      balanceAfter: afterBn.toFormat(),
      difference: differenceBn.toFormat(),
      isIncrease: beforeBn.lte(afterBn),
    };
  }

  const difference = Number(data.balance_after) - Number(data.balance_before);
  return {
    balanceBefore: data.balance_before,
    balanceAfter: data.balance_after,
    difference,
    isIncrease: difference > 0,
  };
}
