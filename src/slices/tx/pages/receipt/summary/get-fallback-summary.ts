// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { CallSummary, TransferSummary } from './types';
import type { schemas } from '@blockscout/api-types';

export type FallbackSummaryTx = Pick<schemas['TransactionResponse'], 'from' | 'to' | 'created_contract' | 'method' | 'value'>;

export const getFallbackSummary = (tx: FallbackSummaryTx, nativeCoinDecimals: number): CallSummary | TransferSummary => {
  if (tx.to?.is_contract) {
    return {
      type: 'call',
      method: tx.method ?? 'Executed a contract call',
      from: tx.from,
      to: tx.to,
    };
  }

  return {
    type: 'transfer',
    amount: BigNumber(tx.value).shiftedBy(-nativeCoinDecimals).toFixed(),
    asset: { type: 'native' },
    from: tx.from,
    to: tx.to ?? tx.created_contract,
  };
};
