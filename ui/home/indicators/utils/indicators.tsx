import React from 'react';

import type { TChainIndicator } from '../types';
import type { TimeChartItem, TimeChartItemRaw } from 'ui/shared/chart/types';

import config from 'configs/app';
import { sortByDateDesc } from 'ui/shared/chart/utils/sorts';
import IconSvg from 'ui/shared/IconSvg';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';

const nonNullTailReducer = (result: Array<TimeChartItemRaw>, item: TimeChartItemRaw) => {
  if (item.value === null && result.length === 0) {
    return result;
  }
  result.unshift(item);
  return result;
};

const mapNullToZero: (item: TimeChartItemRaw) => TimeChartItem = (item) => ({ ...item, value: Number(item.value) });

const dailyTxsIndicator: TChainIndicator<'stats_charts_txs'> = {
  id: 'daily_txs',
  title: 'Daily transactions',
  value: (stats) => stats.transactions_today === null ?
    'N/A' :
    Number(stats.transactions_today).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  icon: <IconSvg name="transactions" boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
  hint: `Number of transactions yesterday (0:00 - 23:59 UTC). The chart displays daily transactions for the past 30 days.`,
  api: {
    resourceName: 'stats_charts_txs',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.transaction_count }))
        .sort(sortByDateDesc)
        .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
        .map(mapNullToZero),
      name: 'Tx/day',
      valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    } ]),
  },
};

const coinPriceIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'coin_price',
  title: `${ config.chain.currency.symbol } price`,
  value: (stats) => stats.coin_price === null ?
    '$N/A' :
    '$' + Number(stats.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  valueDiff: (stats) => stats?.coin_price !== null ? stats?.coin_price_change_percentage : null,
  icon: <NativeTokenIcon boxSize={ 6 }/>,
  hint: `${ config.chain.currency.symbol } token daily price in USD.`,
  api: {
    resourceName: 'stats_charts_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.closing_price }))
        .sort(sortByDateDesc)
        .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
        .map(mapNullToZero),
      name: `${ config.chain.currency.symbol } price`,
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const secondaryCoinPriceIndicator: TChainIndicator<'stats_charts_secondary_coin_price'> = {
  id: 'secondary_coin_price',
  title: `${ config.chain.secondaryCoin.symbol } price`,
  value: (stats) => !stats.secondary_coin_price || stats.secondary_coin_price === null ?
    '$N/A' :
    '$' + Number(stats.secondary_coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  valueDiff: () => null,
  icon: <NativeTokenIcon boxSize={ 6 } type="secondary"/>,
  hint: `${ config.chain.secondaryCoin.symbol } token daily price in USD.`,
  api: {
    resourceName: 'stats_charts_secondary_coin_price',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.closing_price }))
        .sort(sortByDateDesc)
        .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
        .map(mapNullToZero),
      name: `${ config.chain.secondaryCoin.symbol } price`,
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const marketPriceIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'market_cap',
  title: 'Market cap',
  value: (stats) => stats.market_cap === null ?
    '$N/A' :
    '$' + Number(stats.market_cap).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
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
            value: (() => {
              if (item.market_cap !== undefined) {
                return item.market_cap;
              }

              if (item.closing_price === null) {
                return null;
              }

              return Number(item.closing_price) * Number(response.available_supply);
            })(),
          }))
        .sort(sortByDateDesc)
        .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
        .map(mapNullToZero),
      name: 'Market cap',
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    } ]),
  },
};

const tvlIndicator: TChainIndicator<'stats_charts_market'> = {
  id: 'tvl',
  title: 'Total value locked',
  value: (stats) => stats.tvl === null ?
    '$N/A' :
    '$' + Number(stats.tvl).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  icon: <IconSvg name="lock" boxSize={ 6 } bgColor="#517FDB" borderRadius="base" color="white"/>,
  hint: 'Total value of digital assets locked or staked in a chain',
  api: {
    resourceName: 'stats_charts_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => (
          {
            date: new Date(item.date),
            value: item.tvl !== undefined ? item.tvl : 0,
          }))
        .sort(sortByDateDesc)
        .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
        .map(mapNullToZero),
      name: 'TVL',
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    } ]),
  },
};

const INDICATORS = [
  dailyTxsIndicator,
  coinPriceIndicator,
  secondaryCoinPriceIndicator,
  marketPriceIndicator,
  tvlIndicator,
];

export default INDICATORS;
