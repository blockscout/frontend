import type { HomeStats } from 'types/api/stats';

export const base: HomeStats = {
  average_block_time: 6212.0,
  coin_price: '0.00199678',
  gas_prices: {
    average: 48.0,
    fast: 67.5,
    slow: 48.0,
  },
  gas_used_today: '4108680603',
  market_cap: '330809.96443288102524',
  network_utilization_percentage: 1.55372064,
  static_gas_price: '10',
  total_addresses: '19667249',
  total_blocks: '30215608',
  total_gas_used: '0',
  total_transactions: '82258122',
  transactions_today: '26815',
  tvl: '1767425.102766552',
};

export const withBtcLocked: HomeStats = {
  ...base,
  rootstock_locked_btc: '3337493406696977561374',
};
