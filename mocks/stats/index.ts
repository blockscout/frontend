import _mapValues from 'lodash/mapValues';

export const base = {
  average_block_time: 6212.0,
  coin_price: '0.00199678',
  coin_price_change_percentage: -7.42,
  gas_prices: {
    average: {
      fiat_price: '1.39',
      price: 23.75,
      time: 12030.25,
      base_fee: 2.22222,
      priority_fee: 12.424242,
    },
    fast: {
      fiat_price: '1.74',
      price: 29.72,
      time: 8763.25,
      base_fee: 4.44444,
      priority_fee: 22.242424,
    },
    slow: {
      fiat_price: '1.35',
      price: 23.04,
      time: 20100.25,
      base_fee: 1.11111,
      priority_fee: 7.8909,
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

export const withBtcLocked = {
  ...base,
  rootstock_locked_btc: '3337493406696977561374',
};

export const withoutFiatPrices = {
  ...base,
  gas_prices: _mapValues(base.gas_prices, (price) => price ? ({ ...price, fiat_price: null }) : null),
};

export const withoutGweiPrices = {
  ...base,
  gas_prices: _mapValues(base.gas_prices, (price) => price ? ({ ...price, price: null }) : null),
};

export const withoutBothPrices = {
  ...base,
  gas_prices: _mapValues(base.gas_prices, (price) => price ? ({ ...price, price: null, fiat_price: null }) : null),
};
