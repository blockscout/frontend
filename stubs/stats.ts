import type * as stats from '@blockscout/stats-types';
import type { HomeStats } from 'types/api/stats';

import { CHAIN_STATS_CHART_INFO } from 'client/features/chain-stats/stubs/charts';
import { CHAIN_STATS_COUNTER } from 'client/features/chain-stats/stubs/counters';

export const HOMEPAGE_STATS: HomeStats = {
  average_block_time: 14346,
  coin_price: '1807.68',
  coin_price_change_percentage: 42,
  gas_prices: {
    average: {
      fiat_price: '1.01',
      price: 20.41,
      time: 12283,
      base_fee: 2.22222,
      priority_fee: 12.424242,
    },
    fast: {
      fiat_price: '1.26',
      price: 25.47,
      time: 9321,
      base_fee: 4.44444,
      priority_fee: 22.242424,
    },
    slow: {
      fiat_price: '0.97',
      price: 19.55,
      time: 24543,
      base_fee: 1.11111,
      priority_fee: 7.8909,
    },
  },
  gas_price_updated_at: '2022-11-11T11:09:49.051171Z',
  gas_prices_update_in: 300000,
  gas_used_today: '0',
  market_cap: '0',
  network_utilization_percentage: 22.56,
  static_gas_price: null,
  total_addresses: '28634064',
  total_blocks: '8940150',
  total_gas_used: '0',
  total_transactions: '193823272',
  transactions_today: '0',
  tvl: '1767425.102766552',
};

export const HOMEPAGE_STATS_MICROSERVICE: stats.MainPageStats = {
  average_block_time: CHAIN_STATS_COUNTER,
  total_addresses: CHAIN_STATS_COUNTER,
  total_blocks: CHAIN_STATS_COUNTER,
  total_transactions: CHAIN_STATS_COUNTER,
  yesterday_transactions: CHAIN_STATS_COUNTER,
  total_operational_transactions: CHAIN_STATS_COUNTER,
  yesterday_operational_transactions: CHAIN_STATS_COUNTER,
  daily_new_transactions: {
    chart: [],
    info: { ...CHAIN_STATS_CHART_INFO, title: 'Daily transactions' },
  },
  daily_new_operational_transactions: {
    chart: [],
    info: { ...CHAIN_STATS_CHART_INFO, title: 'Daily op txns' },
  },
};
