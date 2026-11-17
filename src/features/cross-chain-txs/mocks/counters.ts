import type * as stats from '@blockscout/stats-types';

export const counters: stats.Counters = {
  counters: [
    {
      id: 'totalInterchainMessages',
      value: '100',
      title: 'Total interchain messages',
      description: 'Total indexed inter-chain messages',
    },
    {
      id: 'newMessagesInterchain24h',
      value: '42',
      title: 'New interchain messages (24h)',
      description: 'Number of new interchain messages within the last 24 hours',
    },
    {
      id: 'totalInterchainTransfers',
      value: '101',
      title: 'Total interchain transfers',
      description: 'Total indexed inter-chain transfers',
    },
    {
      id: 'newTransfersInterchain24h',
      value: '55',
      title: 'New interchain transfers (24h)',
      description: 'Number of new interchain transfers within the last 24 hours',
    },
  ],
};
