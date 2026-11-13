// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';

type Address = schemas['Address'];

interface CallFallbackSummary {
  readonly type: 'call';
  readonly method: string;
  readonly from: Address;
  readonly to: Address;
}

interface TransferFallbackSummary {
  readonly type: 'transfer';
  readonly amount: string;
  readonly from: Address;
  readonly to: Address | null;
}

export type FallbackSummary = CallFallbackSummary | TransferFallbackSummary;

type FallbackSummaryTx = Pick<schemas['TransactionResponse'], 'from' | 'to' | 'created_contract' | 'method' | 'value'>;

export const getFallbackSummary = (tx: FallbackSummaryTx, nativeCoinDecimals: number): FallbackSummary => {
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
    from: tx.from,
    to: tx.to ?? tx.created_contract,
  };
};
