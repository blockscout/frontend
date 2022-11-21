import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TChainIndicator } from '../types';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import globeIcon from 'icons/globe.svg';
import txIcon from 'icons/transactions.svg';
import { shortenNumberWithLetter } from 'lib/formatters';
import { sortByDateDesc } from 'ui/shared/chart/utils/sorts';
import TokenLogo from 'ui/shared/TokenLogo';

const dailyTxsIndicator: TChainIndicator<QueryKeys.chartsTxs> = {
  id: 'daily_txs',
  title: 'Daily transactions',
  value: (stats) => shortenNumberWithLetter(Number(stats.transactions_today), undefined, { maximumFractionDigits: 2 }),
  icon: <Icon as={ txIcon } boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
  hint: `The total daily number of transactions on the blockchain for the last month.`,
  api: {
    queryName: QueryKeys.chartsTxs,
    path: '/node-api/stats/charts/transactions',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.tx_count }))
        .sort(sortByDateDesc),
      name: 'Tx/day',
      valueFormatter: (x) => shortenNumberWithLetter(x, undefined, { maximumFractionDigits: 2 }),
    } ]),
  },
};

const coinPriceIndicator: TChainIndicator<QueryKeys.chartsMarket> = {
  id: 'coin_price',
  title: `${ appConfig.network.currency.symbol } price`,
  value: (stats) => '$' + Number(stats.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  icon: <TokenLogo hash={ appConfig.network.nativeTokenAddress || '' } name={ appConfig.network.currency.name } boxSize={ 6 }/>,
  hint: `${ appConfig.network.currency.symbol } token daily price in USD.`,
  api: {
    queryName: QueryKeys.chartsMarket,
    path: '/node-api/stats/charts/market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) }))
        .sort(sortByDateDesc),
      name: `${ appConfig.network.currency.symbol } price`,
      valueFormatter: (x) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const marketPriceIndicator: TChainIndicator<QueryKeys.chartsMarket> = {
  id: 'market_cup',
  title: 'Market cap',
  value: (stats) => '$' + shortenNumberWithLetter(Number(stats.market_cap), undefined, { maximumFractionDigits: 0 }),
  icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
  // eslint-disable-next-line max-len
  hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  api: {
    queryName: QueryKeys.chartsMarket,
    path: '/node-api/stats/charts/market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) * Number(response.available_supply) }))
        .sort(sortByDateDesc),
      name: 'Market cap',
      valueFormatter: (x) => '$' + shortenNumberWithLetter(x, undefined, { maximumFractionDigits: 0 }),
    } ]),
  },
};

const INDICATORS = [
  dailyTxsIndicator,
  coinPriceIndicator,
  marketPriceIndicator,
];

export default INDICATORS;
