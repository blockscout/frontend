import { hexToNumber } from 'viem';

import type { HomeStats } from 'types/api/stats';

import { HOMEPAGE_STATS } from 'stubs/stats';

import useCustomApiQuery from './api/custom/useCustomApiQuery';
import useApiQuery from './api/useApiQuery';
import { useFetchChainState } from './getChainState';

export const useRwaStatsQuery = () => {
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const {
    data: apiData,
    error: apiError,
    isLoading: apiIsLoading,
  } = useCustomApiQuery('https://price.assetchain.org/api/v1/price');

  const apiDataTyped = apiData as {
    data: {
      price: string;
      usd_market_cap: string;
      usd_24h_change: number;
    };
  };

  const chainStateResult = useFetchChainState();

  const mergedData = {
    ...statsQueryResult.data,
    isPlaceholderData: false,
    coin_price: apiDataTyped?.data?.price,
    market_cap: apiDataTyped?.data?.usd_market_cap,
    coin_price_change_percentage: Number(Number(apiDataTyped?.data?.usd_24h_change).toFixed(2)),
    rwa_total_supply: chainStateResult.data?.sealedEpoch.totalSupply ?
      hexToNumber(chainStateResult.data?.sealedEpoch.totalSupply) / 1e18 :
      0,
  };

  const isLoading = statsQueryResult.isLoading || apiIsLoading;
  const error = statsQueryResult.error || apiError;

  return { data: mergedData as HomeStats, error, isLoading };
};
