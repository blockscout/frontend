import type { Transaction } from 'types/api/transaction';

import { tx } from './tx';
import type { TxType } from './tx';

export const txs = [
  {
    ...tx,
    method: 'Withdraw',
    txType: 'transaction' as TxType,
    errorText: '',
  },
  {
    ...tx,
    status: 'error' as Transaction['status'],
    errorText: 'Error: (Awaiting internal transactions for reason)',
    txType: 'contract-call' as TxType,
    method: 'CommitHash CommitHash CommitHash CommitHash',
    amount: {
      value: 0.04,
      value_usd: 35.5,
    },
    fee: {
      value: 0.002295904453623692,
      value_usd: 2.84,
    },
  },
  {
    ...tx,
    status: null,
    txType: 'token-transfer' as TxType,
    method: 'Multicall',
    address_from: {
      hash: '0x97Aa2EfcF35c0f4c9AaDDCa8c2330fa7A9533830',
      alias: 'tkdkdkdkdkdkdkdkdkdkdkdkdkdkd.eth',
      type: 'ENS name',
    },
    amount: {
      value: 0.02,
      value_usd: 35.5,
    },
    fee: {
      value: 0.002495904453623692,
      value_usd: 2.84,
    },
    errorText: '',
  },
];
