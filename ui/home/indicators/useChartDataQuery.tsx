import type { ChainIndicatorId } from 'types/homepage';
import type { TimeChartData, TimeChartDataItem, TimeChartItemRaw } from 'ui/shared/chart/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

import prepareChartItems from './utils/prepareChartItems';

const CHART_ITEMS: Record<ChainIndicatorId, Pick<TimeChartDataItem, 'name' | 'valueFormatter'>> = {
  daily_txs: {
    name: 'Tx/day',
    valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
  daily_operational_txs: {
    name: 'Tx/day',
    valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
  coin_price: {
    name: `${ config.chain.currency.symbol } price`,
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  secondary_coin_price: {
    name: `${ config.chain.currency.symbol } price`,
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  market_cap: {
    name: 'Market cap',
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  },
  tvl: {
    name: 'TVL',
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
};

const isStatsFeatureEnabled = config.features.stats.isEnabled;

type UseFetchChartDataResult = {
  isError: boolean;
  isPending: boolean;
  data: TimeChartData;
};

function getChartData(indicatorId: ChainIndicatorId, data: Array<TimeChartItemRaw>): TimeChartData {
  return [ {
    items: prepareChartItems(data),
    name: CHART_ITEMS[indicatorId].name,
    valueFormatter: CHART_ITEMS[indicatorId].valueFormatter,
  } ];
}

export default function useChartDataQuery(indicatorId: ChainIndicatorId): UseFetchChartDataResult {
  const statsDailyTxsQuery = useApiQuery('stats_main', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isStatsFeatureEnabled && indicatorId === 'daily_txs',
      select: (data) => data.daily_new_transactions?.chart.map((item) => ({ date: new Date(item.date), value: Number(item.value) })) || [],
    },
  });

  const statsDailyOperationalTxsQuery = useApiQuery('stats_main', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isStatsFeatureEnabled && indicatorId === 'daily_operational_txs',
      select: (data) => data.daily_new_operational_transactions?.chart.map((item) => ({ date: new Date(item.date), value: Number(item.value) })) || [],
    },
  });

  const apiDailyTxsQuery = useApiQuery('stats_charts_txs', {
    queryOptions: {
      refetchOnMount: false,
      enabled: !isStatsFeatureEnabled && indicatorId === 'daily_txs',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.transaction_count })),
    },
  });

  const coinPriceQuery = useApiQuery('stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'coin_price',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.closing_price })),
    },
  });

  const secondaryCoinPriceQuery = useApiQuery('stats_charts_secondary_coin_price', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'secondary_coin_price',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.closing_price })),
    },
  });

  const marketCapQuery = useApiQuery('stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'market_cap',
      select: (data) => data.chart_data.map((item) => (
        {
          date: new Date(item.date),
          value: (() => {
            if (item.market_cap !== undefined) {
              return item.market_cap;
            }

            if (item.closing_price === null) {
              return null;
            }

            return Number(item.closing_price) * Number(data.available_supply);
          })(),
        })),
    },
  });

  const tvlQuery = useApiQuery('stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'tvl',
      select: (data) => data.chart_data.map((item) => (
        {
          date: new Date(item.date),
          value: item.tvl !== undefined ? item.tvl : 0,
        })),
    },
  });

  switch (indicatorId) {
    case 'daily_txs': {
      const query = isStatsFeatureEnabled ? statsDailyTxsQuery : apiDailyTxsQuery;
      return {
        data: getChartData(indicatorId, query.data || []),
        isError: query.isError,
        isPending: query.isPending,
      };
    }
    case 'daily_operational_txs': {
      return {
        data: getChartData(indicatorId, statsDailyOperationalTxsQuery.data || []),
        isError: statsDailyOperationalTxsQuery.isError,
        isPending: statsDailyOperationalTxsQuery.isPending,
      };
    }
    case 'coin_price': {
      return {
        data: getChartData(indicatorId, coinPriceQuery.data || []),
        isError: coinPriceQuery.isError,
        isPending: coinPriceQuery.isPending,
      };
    }
    case 'secondary_coin_price': {
      return {
        data: getChartData(indicatorId, secondaryCoinPriceQuery.data || []),
        isError: secondaryCoinPriceQuery.isError,
        isPending: secondaryCoinPriceQuery.isPending,
      };
    }
    case 'market_cap': {
      return {
        data: getChartData(indicatorId, marketCapQuery.data || []),
        isError: marketCapQuery.isError,
        isPending: marketCapQuery.isPending,
      };
    }
    case 'tvl': {
      return {
        data: getChartData(indicatorId, tvlQuery.data || []),
        isError: tvlQuery.isError,
        isPending: tvlQuery.isPending,
      };
    }
  }
}
