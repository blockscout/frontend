import type { HomeStats } from 'types/api/stats';

export const base: HomeStats = {
  average_block_time: 6212.0,
  coin_price: '0.00199678',
  coin_price_change_percentage: -7.42,
  gas_prices: {
    average: {
      fiat_price: '1.01',
      price: 20.41,
      time: 12283,
    },
    fast: {
      fiat_price: '1.26',
      price: 25.47,
      time: 9321,
    },
    slow: {
      fiat_price: '0.97',
      price: 19.55,
      time: 24543,
    },
  },
  gas_price_updated_at: '2022-11-11T11:09:49.051171Z',
  gas_prices_update_in: 300000,
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
