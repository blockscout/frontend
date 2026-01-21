import type * as stats from '@blockscout/stats-types';

import { averageGasPrice } from 'mocks/stats/line';

export const mainPageStats: stats.MainPageMultichainStats = {
  total_multichain_txns: {
    id: 'totalMultichainTxns',
    value: '741682908',
    title: 'Total transactions',
    units: undefined,
    description: 'Number of transactions across all chains in the cluster',
  },
  total_multichain_addresses: {
    id: 'totalMultichainAddresses',
    value: '153519638',
    title: 'Total addresses',
    units: undefined,
    description: 'Number of addresses across all chains in the cluster',
  },
  new_txns_multichain_window: {
    chart: averageGasPrice.chart,
    info: {
      id: 'newTxnsMultichainWindow',
      title: 'New transactions',
      description: 'Number of new transactions across all chains in the cluster',
      resolutions: [ 'DAY' ],
    },
  },
  yesterday_txns_multichain: {
    id: 'yesterdayTxnsMultichain',
    value: '1026175',
    title: 'Yesterday txns',
    units: undefined,
    description: 'Number of transactions yesterday (0:00 - 23:59 UTC) across all chains in the cluster',
  },
};
