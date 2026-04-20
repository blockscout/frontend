import { Text, createListCollection, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import type { LineChartInfo, Resolution } from '@blockscout/stats-types';
import type { TimeChartItem } from 'toolkit/components/charts/types';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { Button } from 'toolkit/chakra/button';
import type { OnValueChangeHandler, SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ChartWidgetContent } from 'toolkit/components/charts/ChartWidgetContent';
import ChartMenu from 'toolkit/components/charts/parts/ChartMenu';
import { useChartZoom } from 'toolkit/components/charts/utils/useChartZoom';
import { isBrowser } from 'toolkit/utils/isBrowser';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import { useChartsConfig } from 'ui/shared/chart/config';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

import ChartIntervalSelect from '../../components/ChartIntervalSelect';
import { STATS_RESOLUTIONS, DEFAULT_RESOLUTION } from '../../utils/consts';

interface Props {
  id: string;
  info?: LineChartInfo;
  data?: Array<TimeChartItem>;
  isLoading: boolean;
  isError: boolean;
  isInitialLoading: boolean;
  interval: StatsIntervalIds;
  resolution: Resolution;
  onIntervalChange: (interval: StatsIntervalIds) => void;
  onResolutionChange: OnValueChangeHandler;
}

const ChainStatsDetailsLineChart = ({
  id,
  info,
  data,
  isLoading,
  isError,
  isInitialLoading,
  interval,
  resolution,
  onIntervalChange,
  onResolutionChange,
}: Props) => {

  const ref = React.useRef<HTMLDivElement>(null);

  const chartsConfig = useChartsConfig();
  const isMobile = useIsMobile();
  const isInBrowser = isBrowser();
  const chainSelect = useRoutedChainSelect();
  const multichainContext = useMultichainContext();
  const router = useRouter();

  const { zoomRange, handleZoom, handleZoomReset: onZoomReset } = useChartZoom();

  const handleZoomReset = React.useCallback(() => {
    onZoomReset();
    onResolutionChange({ value: [ DEFAULT_RESOLUTION ] });
  }, [ onZoomReset, onResolutionChange ]);

  const handleShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: id });
    try {
      await window.navigator.share({
        title: info?.title,
        text: info?.description,
        url: window.location.href,
      });
    } catch (error) {}
  }, [ id, info?.description, info?.title ]);

  const shareButton = (
    <Button
      size="sm"
      variant="outline"
      onClick={ handleShare }
      ml={ 6 }
      loadingSkeleton={ isLoading }
    >
      <IconSvg name="share" w={ 4 } h={ 4 }/>
      Share
    </Button>
  );

  const resolutionCollection = React.useMemo(() => {
    const resolutions = info?.resolutions || [];
    const items = STATS_RESOLUTIONS
      .filter((resolution) => resolutions.includes(resolution.id))
      .map((resolution) => ({ value: resolution.id, label: resolution.title }));

    return createListCollection<SelectOption>({ items });
  }, [ info?.resolutions ]);

  const charts = React.useMemo(() => {
    if (!info || !data) {
      return [];
    }

    return [
      {
        id: info.id,
        name: 'Value',
        items: data,
        charts: chartsConfig,
        units: info.units,
      },
    ];
  }, [ chartsConfig, data, info ]);

  const hasNonEmptyCharts = charts.some((chart) => chart.items.length > 2);
  const hasItems = (data && data.length > 2) || isLoading;

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={{ base: 3, lg: 6 }} maxW="100%">
          { multichainContext?.chain && (
            <ChainSelect
              value={ chainSelect.value }
              onValueChange={ chainSelect.onValueChange }
              loading={ isInitialLoading }
            />
          ) }
          <Flex alignItems="center" gap={ 3 }>
            { !isMobile && <Text>Period</Text> }
            <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange }/>
          </Flex>
          { (info?.resolutions && info?.resolutions.length > 1) && (
            <Flex alignItems="center" gap={ 3 }>
              <Skeleton loading={ isInitialLoading }>
                { isMobile ? 'Res.' : 'Resolution' }
              </Skeleton>
              <Select
                collection={ resolutionCollection }
                placeholder="Select resolution"
                defaultValue={ [ resolution ] }
                onValueChange={ onResolutionChange }
                w={{ base: 'fit-content', lg: '160px' }}
                loading={ isInitialLoading }
              />
            </Flex>
          ) }
          { (Boolean(zoomRange)) && (
            <Button
              variant="link"
              onClick={ handleZoomReset }
              display="flex"
              alignItems="center"
              gap={ 2 }
            >
              <IconSvg name="repeat" w={ 5 } h={ 5 }/>
              { !isMobile && 'Reset' }
            </Button>
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
                type="link"
                ml={ 0 }
                borderRadius="base"
                variant="icon_background"
                size="md"
                boxSize={ 8 }
              />
            )
          )) }
          { (hasItems || isLoading) && (
            <ChartMenu
              charts={ charts }
              title={ info?.title || '' }
              description={ info?.description || '' }
              isLoading={ isLoading }
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
          isError={ isError }
          charts={ charts }
          isEnlarged
          isLoading={ isLoading }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          empty={ !hasNonEmptyCharts }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
        />
      </Flex>
    </>
  );
};

export default React.memo(ChainStatsDetailsLineChart);
