import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import type { ChartResolution } from 'toolkit/components/charts/types';

import useChartQuery from 'client/features/chain-stats/hooks/useChartQuery';
import ChainStatsDetailsCrossChainTxs from 'client/features/cross-chain-txs/components/ChainStatsDetailsCrossChainTxs';
import useCrossChainChartQuery from 'client/features/cross-chain-txs/hooks/useCrossChainChartQuery';
import { CROSS_CHAIN_TXS_CHARTS } from 'client/features/cross-chain-txs/utils/chain-stats';
import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import { useQueryParams } from 'lib/router/useQueryParams';
import type { OnValueChangeHandler } from 'toolkit/chakra/select';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import { ALL_OPTION, isAllOption } from 'ui/shared/externalChains/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';

import { getIntervalByResolution, getIntervalFromQuery } from '../../utils/interval';
import { DEFAULT_RESOLUTION, getResolutionFromQuery } from '../../utils/resolution';
import ChainStatsDetailsLineChart from './ChainStatsDetailsLineChart';

const ChainStatsDetails = () => {
  const router = useRouter();
  const { updateQuery } = useQueryParams();

  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const counterPartyChainIdsFromQuery = getQueryParamString(router.query.counterparty_chain_ids);

  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;

  const [ resolution, setResolution ] = React.useState<ChartResolution>(defaultResolution);
  const [ interval, setInterval ] = React.useState<StatsIntervalIds>(intervalFromQuery ?? getIntervalByResolution(resolution));
  const [ counterPartyChainIds, setCounterPartyChainIds ] = React.useState<Array<string>>(
    counterPartyChainIdsFromQuery ? [ counterPartyChainIdsFromQuery ] : [ ALL_OPTION.value ],
  );

  const crossChainTxsChart = config.features.crossChainTxs.isEnabled ? CROSS_CHAIN_TXS_CHARTS.find((chart) => chart.id === id) : undefined;

  const queryBase = useChartQuery({ id, resolution, interval, enabled: !crossChainTxsChart });
  const queryCrossChain = useCrossChainChartQuery({ id, interval, counterPartyChainIds, enabled: Boolean(crossChainTxsChart) });

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
    if (!isInitialLoading && query.data?.info && !config.meta.seo.enhancedDataEnabled) {
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
