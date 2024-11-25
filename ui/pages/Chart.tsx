import { Button, Flex, Link, Skeleton, Text } from '@chakra-ui/react';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';
import { StatsIntervalId } from 'types/client/stats';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import isBrowser from 'lib/isBrowser';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import ChartMenu from 'ui/shared/chart/ChartMenu';
import ChartResolutionSelect from 'ui/shared/chart/ChartResolutionSelect';
import ChartWidgetContent from 'ui/shared/chart/ChartWidgetContent';
import useChartQuery from 'ui/shared/chart/useChartQuery';
import useZoom from 'ui/shared/chart/useZoom';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const DEFAULT_RESOLUTION = Resolution.DAY;

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

const Chart = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>(intervalFromQuery);
  const [ resolution, setResolution ] = React.useState<Resolution>(resolutionFromQuery || DEFAULT_RESOLUTION);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();

  const interval = intervalState || getIntervalByResolution(resolution);

  const ref = React.useRef(null);

  const isMobile = useIsMobile();
  const isInBrowser = isBrowser();

  const appProps = useAppContext();
  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/stats');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to charts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const onIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
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

  const onResolutionChange = React.useCallback((resolution: Resolution) => {
    setResolution(resolution);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, resolution },
    },
    undefined,
    { shallow: true },
    );
  }, [ setResolution, router ]);

  const handleReset = React.useCallback(() => {
    handleZoomReset();
    onResolutionChange(DEFAULT_RESOLUTION);
  }, [ handleZoomReset, onResolutionChange ]);

  const { items, info, lineQuery } = useChartQuery(id, resolution, interval);

  React.useEffect(() => {
    if (info && !config.meta.seo.enhancedDataEnabled) {
      metadata.update({ pathname: '/stats/[id]', query: { id } }, info);
    }
  }, [ info, id ]);

  const onShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: id });
    try {
      await window.navigator.share({
        title: info?.title,
        text: info?.description,
        url: window.location.href,
      });
    } catch (error) {}
  }, [ info, id ]);

  if (lineQuery.isError) {
    if (isCustomAppError(lineQuery.error)) {
      throwOnResourceLoadError({ resource: 'stats_line', error: lineQuery.error, isError: true });
    }
  }

  const hasItems = (items && items.length > 2) || lineQuery.isPending;

  const isInfoLoading = !info && lineQuery.isPlaceholderData;

  const shareButton = (
    <Button
      leftIcon={ <IconSvg name="share" w={ 4 } h={ 4 }/> }
      colorScheme="blue"
      size="sm"
      variant="outline"
      onClick={ onShare }
      ml={ 6 }
    >
      Share
    </Button>
  );

  return (
    <>
      <PageTitle
        title={ info?.title || lineQuery.data?.info?.title || '' }
        mb={ 3 }
        isLoading={ isInfoLoading }
        backLink={ backLink }
        secondRow={ info?.description || lineQuery.data?.info?.description }
        withTextAd
      />
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={{ base: 3, lg: 6 }} maxW="100%" overflow="hidden">
          <Flex alignItems="center" gap={ 3 }>
            { !isMobile && <Text>Period</Text> }
            <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange }/>
          </Flex>
          { (
            (info?.resolutions && info?.resolutions.length > 1) ||
            (!info && lineQuery.data?.info?.resolutions && lineQuery.data?.info?.resolutions.length > 1)
          ) && (
            <Flex alignItems="center" gap={ 3 }>
              <Skeleton isLoaded={ !isInfoLoading }>
                { isMobile ? 'Res.' : 'Resolution' }
              </Skeleton>
              <ChartResolutionSelect
                resolution={ resolution }
                onResolutionChange={ onResolutionChange }
                resolutions={ lineQuery.data?.info?.resolutions || [] }
                isLoading={ isInfoLoading }
              />
            </Flex>
          ) }
          { (Boolean(zoomRange)) && (
            <Link
              onClick={ handleReset }
              display="flex"
              alignItems="center"
              gap={ 2 }
            >
              <IconSvg name="repeat" w={ 5 } h={ 5 }/>
              { !isMobile && 'Reset' }
            </Link>
          ) }
        </Flex>
        <Flex alignItems="center" gap={ 3 }>
          { /* TS thinks window.navigator.share can't be undefined, but it can */ }
          { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
          { !isMobile && (isInBrowser && ((window.navigator.share as any) ?
            shareButton :
            (
              <CopyToClipboard
                text={ config.app.baseUrl + router.asPath }
                size={ 5 }
                type="link"
                variant="outline"
                colorScheme="blue"
                display="flex"
                borderRadius="8px"
                width={ 8 }
                height={ 8 }
              />
            )
          )) }
          { (hasItems || lineQuery.isPlaceholderData) && (
            <ChartMenu
              items={ items }
              title={ info?.title || '' }
              isLoading={ lineQuery.isPlaceholderData }
              chartRef={ ref }
              resolution={ resolution }
              zoomRange={ zoomRange }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              chartUrl={ isMobile ? window.location.href : undefined }
            />
          ) }
        </Flex>
      </Flex>
      <Flex
        ref={ ref }
        flexGrow={ 1 }
        h="50vh"
        mt={ 3 }
        position="relative"
      >
        <ChartWidgetContent
          isError={ lineQuery.isError }
          items={ items }
          title={ info?.title || '' }
          units={ info?.units || undefined }
          isEnlarged
          isLoading={ lineQuery.isPlaceholderData }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
        />
      </Flex>
    </>
  );
};

export default Chart;
