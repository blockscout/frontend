import type { ChartMarketResponse, ChartTransactionResponse } from 'types/api/charts';
import type { HomeStats } from 'types/api/stats';
import type { QueryKeys } from 'types/client/queries';
import type { TimeChartData } from 'ui/shared/chart/types';

export type ChartsQueryKeys = QueryKeys.chartsTxs | QueryKeys.chartsMarket;

export type ChainIndicatorId = 'daily_txs' | 'coin_price' | 'market_cup';

export interface TChainIndicator<Q extends ChartsQueryKeys> {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  icon: React.ReactNode;
  hint?: string;
  api: {
    queryName: Q;
    path: string;
    dataFn: (response: ChartsResponse<Q>) => TimeChartData;
  };
}

export type ChartsResponse<Q extends ChartsQueryKeys> =
    Q extends QueryKeys.chartsTxs ? ChartTransactionResponse :
      Q extends QueryKeys.chartsMarket ? ChartMarketResponse :
        never;
