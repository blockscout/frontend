import { Text, createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';

import type { StatsIntervalIds } from '../../types/client';
import type { LineChartInfo } from '@blockscout/stats-types';
import type { LineChartItem } from 'toolkit/components/charts/line/types';
import { CHART_RESOLUTION_LABELS, type ChartResolution } from 'toolkit/components/charts/types';

import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import type { OnValueChangeHandler, SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ChartResetZoomButton } from 'toolkit/components/charts/components/ChartResetZoomButton';
import { LineChartContent } from 'toolkit/components/charts/line/LineChartContent';
import LineChartMenu from 'toolkit/components/charts/line/parts/LineChartMenu';
import { useLineChartZoom } from 'toolkit/components/charts/line/utils/useLineChartZoom';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import { useChartsConfig } from 'ui/shared/chart/config';

import ChartIntervalSelect from '../../components/ChartIntervalSelect';
import { DEFAULT_RESOLUTION } from '../../utils/consts';

interface Props {
  id: string;
  info?: LineChartInfo;
  data?: Array<LineChartItem>;
  isLoading: boolean;
  isError: boolean;
  isInitialLoading: boolean;
  interval: StatsIntervalIds;
  resolution: ChartResolution;
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
  const chainSelect = useRoutedChainSelect();
  const multichainContext = useMultichainContext();

  const { zoomRange, handleZoom, handleZoomReset: onZoomReset } = useLineChartZoom();

  const handleZoomReset = React.useCallback(() => {
    onZoomReset();
    onResolutionChange({ value: [ DEFAULT_RESOLUTION ] });
  }, [ onZoomReset, onResolutionChange ]);

  const handleShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: id });
  }, [ id ]);

  const resolutionCollection = React.useMemo(() => {
    const resolutions = info?.resolutions || [];
    const items = CHART_RESOLUTION_LABELS
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
        </Flex>
        <Flex alignItems="center" gap={ 3 }>
          <ChartResetZoomButton
            range={ zoomRange }
            onClick={ handleZoomReset }
          />
          { (hasItems || isLoading) && (
            <LineChartMenu
              charts={ charts }
              title={ info?.title || '' }
              description={ info?.description || '' }
              isLoading={ isLoading }
              chartRef={ ref }
              resolution={ resolution }
              zoomRange={ zoomRange }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              chartUrl={ window.location.href }
              onShare={ handleShare }
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
        <LineChartContent
          isError={ isError }
          charts={ charts }
          isEnlarged
          isLoading={ isLoading }
          zoomRange={ zoomRange }
          onZoom={ handleZoom }
          isEmpty={ !hasNonEmptyCharts }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
        />
      </Flex>
    </>
  );
};

export default React.memo(ChainStatsDetailsLineChart);
