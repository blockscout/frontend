import { Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

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
import useZoomReset from 'ui/shared/chart/useZoomReset';
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

const Chart = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>();
  const [ resolution, setResolution ] = React.useState<Resolution>(DEFAULT_RESOLUTION);
  const { isZoomResetInitial, handleZoom, handleZoomReset } = useZoomReset();

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

  const handleReset = React.useCallback(() => {
    handleZoomReset();
    setResolution(DEFAULT_RESOLUTION);
  }, [ handleZoomReset ]);

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

  const shareButton = isMobile ? (
    <IconButton
      aria-label="share"
      variant="outline"
      boxSize={ 8 }
      size="sm"
      icon={ <IconSvg name="share" boxSize={ 5 }/> }
      onClick={ onShare }
    />
  ) : (
    <Button
      leftIcon={ <IconSvg name="share" w={ 4 } h={ 4 }/> }
      colorScheme="blue"
      gridColumn={ 2 }
      justifySelf="end"
      alignSelf="top"
      gridRow="1/3"
      size="sm"
      variant="outline"
      onClick={ onShare }
      ml={ 6 }
    >
      Share
    </Button>
  );

  const shareAndMenu = (
    <Flex alignItems="center" ml="auto" gap={ 3 }>
      { /* TS thinks window.navigator.share can't be undefined, but it can */ }
      { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
      { (isInBrowser && ((window.navigator.share as any) ?
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
        />
      ) }
    </Flex>
  );

  return (
    <>
      <PageTitle
        title={ info?.title || lineQuery.data?.info?.title || '' }
        mb={ 3 }
        isLoading={ isInfoLoading }
        backLink={ backLink }
        afterTitle={ isMobile ? shareAndMenu : undefined }
        secondRow={ info?.description || lineQuery.data?.info?.description }
        withTextAd
      />
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={ 3 } maxW="100%" overflow="hidden">
          <Text>Period</Text>
          <ChartIntervalSelect interval={ interval } onIntervalChange={ setIntervalState }/>
          { lineQuery.data?.info?.resolutions && lineQuery.data?.info?.resolutions.length > 1 && (
            <>
              <Text ml={{ base: 0, lg: 3 }}>{ isMobile ? 'Res.' : 'Resolution' }</Text>
              <ChartResolutionSelect
                resolution={ resolution }
                onResolutionChange={ setResolution }
                resolutions={ lineQuery.data?.info?.resolutions || [] }
              />
            </>
          ) }
          { (!isZoomResetInitial || resolution !== DEFAULT_RESOLUTION) && (
            isMobile ? (
              <IconButton
                aria-label="Reset"
                variant="ghost"
                size="sm"
                icon={ <IconSvg name="repeat" boxSize={ 5 }/> }
                onClick={ handleReset }
              />
            ) : (
              <Button
                leftIcon={ <IconSvg name="repeat" w={ 4 } h={ 4 }/> }
                colorScheme="blue"
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleReset }
                ml={ 6 }
              >
              Reset
              </Button>
            )
          ) }
        </Flex>
        { !isMobile && shareAndMenu }
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
          isZoomResetInitial={ isZoomResetInitial }
          handleZoom={ handleZoom }
          emptyText="No data for the selected resolution & interval."
        />
      </Flex>
    </>
  );
};

export default Chart;
