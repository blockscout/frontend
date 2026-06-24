import { mapValues } from 'es-toolkit';

import type { schemas } from '@blockscout/api-types';

export const base: schemas['StatsResponse'] = {
  average_block_time: 6212.0,
  coin_price: '0.00199678',
  coin_price_change_percentage: -7.42,
  coin_image: 'http://localhost:3100/utia.jpg',
  gas_prices: {
    average: {
      fiat_price: '1.39',
      price: 23.75,
      time: 12030.25,
      base_fee: 2.22222,
      priority_fee: 12.424242,
      priority_fee_wei: '12.424242',
      wei: '12.424242',
    },
    fast: {
      fiat_price: '1.74',
      price: 29.72,
      time: 8763.25,
      base_fee: 4.44444,
      priority_fee: 22.242424,
      priority_fee_wei: '22.242424',
      wei: '22.242424',
    },
    slow: {
      fiat_price: '1.35',
      price: 23.04,
      time: 20100.25,
      base_fee: 1.11111,
      priority_fee: 7.8909,
      priority_fee_wei: '7.8909',
      wei: '7.8909',
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
  secondary_coin_image: null,
  secondary_coin_price: null,
};

export const withBtcLocked: schemas['StatsResponse'] = {
  ...base,
  rootstock_locked_btc: '3337493406696977561374',
};

export const withoutFiatPrices: schemas['StatsResponse'] = {
  ...base,
  gas_prices: base.gas_prices ?
    mapValues(base.gas_prices, (price) => price && typeof price !== 'number' ? ({ ...price, fiat_price: null }) as schemas['StatsGasPriceInfo'] : null) :
    null,
};

export const withoutGweiPrices: schemas['StatsResponse'] = {
  ...base,
  gas_prices: base.gas_prices ?
    mapValues(base.gas_prices, (price) => price && typeof price !== 'number' ? ({ ...price, price: null }) as schemas['StatsGasPriceInfo'] : null) :
    null,
};

export const withoutBothPrices: schemas['StatsResponse'] = {
  ...base,
  gas_prices: base.gas_prices ?
    mapValues(base.gas_prices, (price) => price && typeof price !== 'number' ?
      ({ ...price, price: null, fiat_price: null }) as schemas['StatsGasPriceInfo'] :
      null) :
    null,
};

export const withoutGasInfo: schemas['StatsResponse'] = {
  ...base,
  gas_prices: null,
};

export const withSecondaryCoin: schemas['StatsResponse'] = {
  ...base,
  secondary_coin_price: '3.398',
  secondary_coin_image: 'http://localhost:3100/secondary_utia.jpg',
};

export const noChartData: schemas['StatsResponse'] = {
  ...base,
  transactions_today: '',
  coin_price: null,
  market_cap: '',
  tvl: null,
};
