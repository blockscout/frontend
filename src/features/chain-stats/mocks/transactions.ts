import type * as stats from '@blockscout/stats-types';

export const base: stats.TransactionsPageStats = {
  pending_transactions_30m: {
    id: 'pendingTxns30m',
    value: '1245',
    title: 'Pending transactions',
    description: 'Transactions in the queue over the last 30 minutes',
    units: '',
  },
  transactions_24h: {
    id: 'newTxns24h',
    value: '1197340',
    title: 'Transactions',
    description: 'Transactions over the last 24 hours',
    units: '',
  },
  operational_transactions_24h: {
    id: 'opTxns24h',
    value: '1100000',
    title: 'Operational transactions',
    description: 'Operational transactions over the last 24 hours',
    units: '',
  },
  transactions_fee_24h: {
    id: 'txnsFee24h',
    value: '6734.1',
    title: 'Transactions fees',
    description: 'Fees paid over the last 24 hours',
    units: 'ETH',
  },
  average_transactions_fee_24h: {
    id: 'averageTxnFee24h',
    value: '0.0056',
    title: 'Avg. transaction fee',
    description: 'Average fee paid over the last 24 hours',
    units: 'ETH',
  },
};
