import React from 'react';

import type { TChainIndicator } from '../types';

import config from 'configs/app';
import { sortByDateDesc } from 'ui/shared/chart/utils/sorts';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

const dailyTxsIndicator: TChainIndicator<'stats_charts_txs'> = {
  id: 'daily_txs',
  title: 'Daily transactions',
  value: (stats) => Number(stats.transactions_today).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  icon: <IconSvg name="transactions" boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
  hint: `Number of transactions yesterday (0:00 - 23:59 UTC). The chart displays daily transactions for the past 30 days.`,
  api: {
    resourceName: 'stats_charts_txs',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.tx_count }))
        .sort(sortByDateDesc),
      name: 'Tx/day',
      valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    } ]),
  },
};

const nativeTokenData = {
  name: config.chain.currency.name || '',
  icon_url: '',
  symbol: '',
  address: '',
  type: 'ERC-20' as const,
};

const coinPriceIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'coin_price',
  title: `${ config.chain.governanceToken.symbol || config.chain.currency.symbol } price`,
  value: (stats) => '$' + Number(stats.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  icon: <TokenEntity.Icon token={ nativeTokenData } boxSize={ 6 } marginRight={ 0 }/>,
  hint: `${ config.chain.governanceToken.symbol || config.chain.currency.symbol } token daily price in USD.`,
  api: {
    resourceName: 'stats_charts_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) }))
        .sort(sortByDateDesc),
      name: `${ config.chain.governanceToken.symbol || config.chain.currency.symbol } price`,
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const marketPriceIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'market_cap',
  title: 'Market cap',
  value: (stats) => '$' + Number(stats.market_cap).toLocaleString(undefined, { maximumFractionDigits: 0, notation: 'compact' }),
  icon: <IconSvg name="globe" boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
  // eslint-disable-next-line max-len
  hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  api: {
    resourceName: 'stats_charts_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => (
          {
            date: new Date(item.date),
            value: item.market_cap ? Number(item.market_cap) : Number(item.closing_price) * Number(response.available_supply),
          }))
        .sort(sortByDateDesc),
      name: 'Market cap',
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    } ]),
  },
};

const tvlIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'tvl',
  title: 'Total value locked',
  value: (stats) => '$' + Number(stats.tvl).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  icon: <IconSvg name="lock" boxSize={ 6 } bgColor="#517FDB" borderRadius="base" color="white"/>,
  // eslint-disable-next-line max-len
  hint: 'Total value of digital assets locked or staked in a chain',
  api: {
    resourceName: 'stats_charts_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => (
          {
            date: new Date(item.date),
            value: item.tvl ? Number(item.tvl) : 0,
          }))
        .sort(sortByDateDesc),
      name: 'TVL',
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    } ]),
  },
};

const INDICATORS = [
  dailyTxsIndicator,
  coinPriceIndicator,
  marketPriceIndicator,
  tvlIndicator,
];

export default INDICATORS;
