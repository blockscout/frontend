// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import type { ChartResolution } from 'src/toolkit/components/charts/types';

import * as metadata from 'src/shell/metadata';
import PageTitle from 'src/shell/page/title/PageTitle';

import useChartQuery from 'src/features/chain-stats/hooks/useChartQuery';
import ChainStatsDetailsCrossChainTxs from 'src/features/cross-chain-txs/components/ChainStatsDetailsCrossChainTxs';
import useCrossChainChartQuery from 'src/features/cross-chain-txs/hooks/useCrossChainChartQuery';
import { CROSS_CHAIN_TXS_CHARTS } from 'src/features/cross-chain-txs/utils/chain-stats';
import multichainConfig from 'src/features/multichain/chains-config';
import useRoutedChainSelect from 'src/features/multichain/hooks/useRoutedChainSelect';

import config from 'src/config';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import { ALL_OPTION, isAllOption } from 'src/shared/external-chains/ChainSelect';
import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useQueryParams } from 'src/shared/router/useQueryParams';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

import { getIntervalByResolution, getIntervalFromQuery } from '../../utils/interval';
import { DEFAULT_RESOLUTION, getResolutionFromQuery } from '../../utils/resolution';
import ChainStatsDetailsLineChart from './ChainStatsDetailsLineChart';

const ChainStatsDetails = () => {
  const router = useRouter();
  const { updateQuery } = useQueryParams();

  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const counterPartyChainIdsFromQuery = Array.isArray(router.query.counterparty_chain_ids) ?
    router.query.counterparty_chain_ids :
    [ router.query.counterparty_chain_ids ].filter(Boolean);

  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;

  const [ resolution, setResolution ] = React.useState<ChartResolution>(defaultResolution);
  const [ interval, setInterval ] = React.useState<StatsIntervalIds>(intervalFromQuery ?? getIntervalByResolution(resolution));
  const [ counterPartyChainIds, setCounterPartyChainIds ] = React.useState<Array<string>>(
    counterPartyChainIdsFromQuery.length > 0 ? counterPartyChainIdsFromQuery : [ ALL_OPTION.value ],
  );

  const chainIdsWithCrossChain = React.useMemo(() => {
    return multichainConfig()?.chains
      .filter((chain) => chain.app_config.features.crossChainTxs.isEnabled)
      .map((chain) => chain.id);
  }, []);

  const chainSelectCrossChain = useRoutedChainSelect({
    chainIds: chainIdsWithCrossChain,
  });

  const chainData = React.useMemo(() => {
    const chainId = chainSelectCrossChain.value?.[0];
    if (chainId) {
      return multichainConfig()?.chains.find(({ id }) => id === chainId);
    }
  }, [ chainSelectCrossChain.value ]);

  const crossChainTxsChart = (chainData?.app_config ?? config).features.crossChainTxs.isEnabled ?
    CROSS_CHAIN_TXS_CHARTS.find((chart) => chart.id === id) :
    undefined;

  const queryBase = useChartQuery({ id, resolution, interval, enabled: !crossChainTxsChart });
  const queryCrossChain = useCrossChainChartQuery({ id, interval, counterPartyChainIds, enabled: Boolean(crossChainTxsChart), chainData });

  const query = crossChainTxsChart ? queryCrossChain : queryBase;
  const isInitialLoading = useIsInitialLoading(query.isPlaceholderData);

  const handleIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
    setInterval(interval);
    updateQuery({ interval });
  }, [ updateQuery ]);

  const handleResolutionChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setResolution(value[0] as ChartResolution);
    updateQuery({ resolution: value[0] });
  }, [ updateQuery ]);

  const handleCounterPartyChainIdsChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    setCounterPartyChainIds(value);
    updateQuery({ counterparty_chain_ids: isAllOption(value) ? undefined : value });
  }, [ updateQuery ]);

  React.useEffect(() => {
    if (!isInitialLoading && query.data?.info && !config.metadata.seo.enhancedDataEnabled) {
      metadata.update({ pathname: '/stats/[id]', query: { id } }, query.data.info);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isInitialLoading ]);

  if (query.isError) {
    if (isCustomAppError(query.error)) {
      throwOnResourceLoadError({ resource: 'stats:line', error: query.error, isError: true });
    }
  }

  const chartInfo = query.data?.info;

  const content = (() => {
    if (query.data?.type === 'line') {
      return (
        <ChainStatsDetailsLineChart
          id={ id }
          info={ chartInfo }
          data={ query.data?.data }
          isLoading={ query.isPlaceholderData }
          isError={ query.isError }
          isInitialLoading={ isInitialLoading }
          interval={ interval }
          resolution={ resolution }
          onIntervalChange={ handleIntervalChange }
          onResolutionChange={ handleResolutionChange }
        />
      );
    }

    if (crossChainTxsChart) {
      return (
        <ChainStatsDetailsCrossChainTxs
          chart={ crossChainTxsChart }
          data={ query.data?.data }
          baseChain={ multichainConfig() ? chainData : undefined }
          baseChainSelectProps={ multichainConfig() ? chainSelectCrossChain : undefined }
          isLoading={ query.isPlaceholderData }
          isError={ query.isError }
          isInitialLoading={ isInitialLoading }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          counterPartyChainIds={ counterPartyChainIds }
          onCounterPartyChainIdsChange={ handleCounterPartyChainIdsChange }
        />
      );
    }

    return null;
  })();

  return (
    <>
      <PageTitle
        title={ chartInfo?.title || '' }
        mb={ 3 }
        isLoading={ isInitialLoading }
        secondRow={ chartInfo?.description }
        withTextAd
      />
      { content }
    </>
  );
};

export default ChainStatsDetails;
