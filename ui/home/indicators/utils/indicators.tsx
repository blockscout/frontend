import React from 'react';

import type { TChainIndicator } from '../types';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';

const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

const INDICATORS: Array<TChainIndicator> = [
  {
    id: 'daily_txs',
    title: 'Daily transactions',
    titleMicroservice: (stats) => stats.daily_new_transactions?.info?.title,
    value: (stats) => stats.transactions_today === null ?
      'N/A' :
      Number(stats.transactions_today).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    valueMicroservice: (stats) => stats.yesterday_transactions?.value === null ?
      'N/A' :
      Number(stats.yesterday_transactions?.value).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    icon: <IconSvg name="transactions" boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
    hint: `Number of transactions yesterday (0:00 - 23:59 UTC). The chart displays daily transactions for the past 30 days.`,
    hintMicroservice: (stats) => stats.daily_new_transactions?.info?.description,
  },
  {
    id: 'daily_operational_txs',
    title: 'Daily op txns',
    titleMicroservice: (stats) => {
      if (isArbitrumRollup) {
        return stats.daily_new_operational_transactions?.info?.title;
      } else if (isOptimisticRollup) {
        return stats.op_stack_daily_new_operational_transactions?.info?.title;
      }
      return '';
    },
    value: () => 'N/A',
    valueMicroservice: (stats) => {
      if (isArbitrumRollup) {
        return stats.yesterday_operational_transactions?.value === null ?
          'N/A' :
          Number(stats.yesterday_operational_transactions?.value).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' });
      } else if (isOptimisticRollup) {
        return stats.op_stack_yesterday_operational_transactions?.value === null ?
          'N/A' :
          Number(stats.op_stack_yesterday_operational_transactions?.value).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' });
      }
      return;
    },
    icon: <IconSvg name="transactions" boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
    hint: `Number of operational transactions yesterday (0:00 - 23:59 UTC). The chart displays daily operational transactions for the past 30 days.`,
    hintMicroservice: (stats) => stats.daily_new_operational_transactions?.info?.description,
  },
  {
    id: 'coin_price',
    title: `${ config.chain.currency.symbol } price`,
    value: (stats) => stats.coin_price === null ?
      '$N/A' :
      '$' + Number(stats.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    valueDiff: (stats) => stats?.coin_price !== null ? stats?.coin_price_change_percentage : null,
    icon: <NativeTokenIcon boxSize={ 6 }/>,
    hint: `${ config.chain.currency.symbol } token daily price in USD.`,
  },
  {
    id: 'secondary_coin_price',
    title: `${ config.chain.secondaryCoin.symbol } price`,
    value: (stats) => !stats.secondary_coin_price || stats.secondary_coin_price === null ?
      '$N/A' :
      '$' + Number(stats.secondary_coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    valueDiff: () => null,
    icon: <NativeTokenIcon boxSize={ 6 } type="secondary"/>,
    hint: `${ config.chain.secondaryCoin.symbol } token daily price in USD.`,
  },
  {
    id: 'market_cap',
    title: 'Market cap',
    value: (stats) => stats.market_cap === null ?
      '$N/A' :
      '$' + Number(stats.market_cap).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    icon: <IconSvg name="globe" boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
    // eslint-disable-next-line max-len
    hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  },
  {
    id: 'tvl',
    title: 'Total value locked',
    value: (stats) => stats.tvl === null ?
      '$N/A' :
      '$' + Number(stats.tvl).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
    icon: <IconSvg name="lock" boxSize={ 6 } bgColor="#517FDB" borderRadius="base" color="white"/>,
    hint: 'Total value of digital assets locked or staked in a chain',
  },
];

export default INDICATORS;
