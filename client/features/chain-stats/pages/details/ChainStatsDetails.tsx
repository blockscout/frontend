import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import { StatsIntervalId } from '../../types/client';
import { ChartResolution } from 'toolkit/components/charts/types';

import useChartQuery from 'client/features/chain-stats/hooks/useChartQuery';
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

import { CROSS_CHAIN_TXS_CHARTS } from '../../utils/additional-charts';
import { DEFAULT_RESOLUTION } from '../../utils/consts';
import ChainStatsDetailsCrossChainTxsPaths from './ChainStatsDetailsCrossChainTxsPaths';
import ChainStatsDetailsLineChart from './ChainStatsDetailsLineChart';

const getIntervalByResolution = (resolution: ChartResolution): StatsIntervalIds => {
  switch (resolution) {
    case ChartResolution.DAY:
      return 'oneMonth';
    case ChartResolution.WEEK:
      return 'oneMonth';
    case ChartResolution.MONTH:
      return 'oneYear';
    case ChartResolution.YEAR:
      return 'all';
    default:
      return 'oneMonth';
  }
};

const getIntervalFromQuery = (router: NextRouter): StatsIntervalIds | undefined => {
  const intervalFromQuery = getQueryParamString(router.query.interval);

  if (!intervalFromQuery || !Object.values(StatsIntervalId).includes(intervalFromQuery as StatsIntervalIds)) {
    return undefined;
  }

  return intervalFromQuery as StatsIntervalIds;
};

const getResolutionFromQuery = (router: NextRouter) => {
  const resolutionFromQuery = getQueryParamString(router.query.resolution) as (keyof typeof ChartResolution | undefined);

  if (!resolutionFromQuery || !ChartResolution[resolutionFromQuery]) {
    return DEFAULT_RESOLUTION;
  }

  return resolutionFromQuery as ChartResolution;
};

const ChainStatsDetails = () => {
  const router = useRouter();
  const { updateQuery } = useQueryParams();

  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const counterPartyChainIdsFromQuery = getQueryParamString(router.query.counterparty_chain_ids);

  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;

  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>(intervalFromQuery);
  const [ resolution, setResolution ] = React.useState<ChartResolution>(defaultResolution);
  const [ counterPartyChainIds, setCounterPartyChainIds ] = React.useState<Array<string>>(
    counterPartyChainIdsFromQuery ? [ counterPartyChainIdsFromQuery ] : [ ALL_OPTION.value ],
  );

  const interval = intervalState || getIntervalByResolution(resolution);

  const { info, query } = useChartQuery({ id, resolution, interval, counterPartyChainIds });
  const isInitialLoading = useIsInitialLoading(query.isPlaceholderData);

  const handleIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
    setIntervalState(interval);
    updateQuery({ interval });
  }, [ setIntervalState, updateQuery ]);

  const handleResolutionChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setResolution(value[0] as ChartResolution);
    updateQuery({ resolution: value[0] });
  }, [ setResolution, updateQuery ]);

  const handleCounterPartyChainIdsChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    setCounterPartyChainIds(value);
    updateQuery({ counterparty_chain_ids: isAllOption(value) ? undefined : value });
  }, [ updateQuery ]);

  React.useEffect(() => {
    if (info && !config.meta.seo.enhancedDataEnabled) {
      metadata.update({ pathname: '/stats/[id]', query: { id } }, info);
    }
  }, [ info, id ]);

  if (query.isError) {
    if (isCustomAppError(query.error)) {
      throwOnResourceLoadError({ resource: 'stats:line', error: query.error, isError: true });
    }
  }

  const chartInfo = info || query.data?.info;

  const content = (() => {
    if (query.data?.type === 'line') {
      return (
        <ChainStatsDetailsLineChart
          id={ id }
          info={ chartInfo }
          data={ query.data?.data }
          isLoading={ query.isPending }
          isError={ query.isError }
          isInitialLoading={ isInitialLoading }
          interval={ interval }
          resolution={ resolution }
          onIntervalChange={ handleIntervalChange }
          onResolutionChange={ handleResolutionChange }
        />
      );
    }

    const crossChainTxsPathsChart = CROSS_CHAIN_TXS_CHARTS.find((chart) => chart.id === id);
    if (crossChainTxsPathsChart) {
      return (
        <ChainStatsDetailsCrossChainTxsPaths
          chart={ crossChainTxsPathsChart }
          data={ query.data?.data }
          isLoading={ query.isPending }
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
