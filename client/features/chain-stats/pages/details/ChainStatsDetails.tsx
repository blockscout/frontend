import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import { StatsIntervalId } from '../../types/client';
import { Resolution } from '@blockscout/stats-types';

import useChartQuery from 'client/features/chain-stats/hooks/useChartQuery';
import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import PageTitle from 'ui/shared/Page/PageTitle';

import { DEFAULT_RESOLUTION } from '../../utils/consts';
import ChainStatsDetailsLineChart from './ChainStatsDetailsLineChart';

const getIntervalByResolution = (resolution: Resolution): StatsIntervalIds => {
  switch (resolution) {
    case 'DAY':
      return 'oneMonth';
    case 'WEEK':
      return 'oneMonth';
    case 'MONTH':
      return 'oneYear';
    case 'YEAR':
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
  const resolutionFromQuery = getQueryParamString(router.query.resolution);

  if (!resolutionFromQuery || !Resolution[resolutionFromQuery as keyof typeof Resolution]) {
    return DEFAULT_RESOLUTION;
  }

  return resolutionFromQuery as Resolution;
};

const ChainStatsDetails = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;

  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>(intervalFromQuery);
  const [ resolution, setResolution ] = React.useState<Resolution>(defaultResolution);

  const interval = intervalState || getIntervalByResolution(resolution);

  const { info, query } = useChartQuery({ id, resolution, interval });
  const isInitialLoading = useIsInitialLoading(query.isPlaceholderData);

  const handleIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
    setIntervalState(interval);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, interval },
      },
      undefined,
      { shallow: true },
    );
  }, [ setIntervalState, router ]);

  const handleResolutionChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setResolution(value[0] as Resolution);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, resolution: value[0] },
    },
    undefined,
    { shallow: true },
    );
  }, [ setResolution, router ]);

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
