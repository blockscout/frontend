import { tx } from './tx';

export const txs = [
  {
    ...tx,
    method: 'Withdraw',
    txType: 'transaction',
  },
  {
    ...tx,
    status: 'failed',
    txType: 'contract-call',
    method: 'CommitHash CommitHash CommitHash CommitHash',
  },
  {
    ...tx,
    status: 'pending',
    txType: 'token-transfer',
    method: 'Multicall',
    address_from: {
      hash: '0x97Aa2EfcF35c0f4c9AaDDCa8c2330fa7A9533830',
      alias: 'tkdkdkdkdkdkdkdkdkdkdkdkdkdkd.eth',
    },
  },
];
