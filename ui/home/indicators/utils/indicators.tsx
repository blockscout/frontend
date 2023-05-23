import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TChainIndicator } from '../types';

import appConfig from 'configs/app/config';
import globeIcon from 'icons/globe.svg';
import txIcon from 'icons/transactions.svg';
import { sortByDateDesc } from 'ui/shared/chart/utils/sorts';
import TokenLogo from 'ui/shared/TokenLogo';

const dailyTxsIndicator: TChainIndicator<'homepage_chart_txs'> = {
  id: 'daily_txs',
  title: 'Daily transactions',
  value: (stats) => Number(stats.transactions_today).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  icon: <Icon as={ txIcon } boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
  hint: `The total daily number of transactions on the blockchain for the last month.`,
  api: {
    resourceName: 'homepage_chart_txs',
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
  address: appConfig.network.currency.address || '',
  name: appConfig.network.currency.name || '',
  icon_url: '',
};

const coinPriceIndicator: TChainIndicator<'homepage_chart_market'> = {
  id: 'coin_price',
  title: `${ appConfig.network.currency.symbol } price`,
  value: (stats) => '$' + Number(stats.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  icon: <TokenLogo data={ nativeTokenData } boxSize={ 6 }/>,
  hint: `${ appConfig.network.currency.symbol } token daily price in USD.`,
  api: {
    resourceName: 'homepage_chart_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) }))
        .sort(sortByDateDesc),
      name: `${ appConfig.network.currency.symbol } price`,
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const marketPriceIndicator: TChainIndicator<'homepage_chart_market'> = {
  id: 'market_cap',
  title: 'Market cap',
  value: (stats) => '$' + Number(stats.market_cap).toLocaleString(undefined, { maximumFractionDigits: 0, notation: 'compact' }),
  icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
  // eslint-disable-next-line max-len
  hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  api: {
    resourceName: 'homepage_chart_market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) * Number(response.available_supply) }))
        .sort(sortByDateDesc),
      name: 'Market cap',
      valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    } ]),
  },
};

const INDICATORS = [
  dailyTxsIndicator,
  coinPriceIndicator,
  marketPriceIndicator,
];

export default INDICATORS;
