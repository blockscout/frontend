import { Box, Grid } from '@chakra-ui/react';
import React from 'react';

import type { ChainStatsSection, StatsIntervalIds } from '../../types/client';

import ChartWidgetContainerCrossChain from 'client/features/cross-chain-txs/components/ChartWidgetContainerCrossChain';
import { CROSS_CHAIN_TXS_CHARTS } from 'client/features/cross-chain-txs/utils/chain-stats';
import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import { EmptyState } from 'toolkit/chakra/empty-state';
import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartWidgetContainer from '../../components/ChartWidgetContainer';
import ChainStatsErrorAlert from './ChainStatsErrorAlert';

interface Props {
  sections?: Array<ChainStatsSection>;
  displayedSections?: Array<ChainStatsSection>;
  sectionId: string;
  isError: boolean;
  isLoading: boolean;
  initialFilterQuery: string;
  interval: StatsIntervalIds;
};

const ChainStatsSections = ({ isError, isLoading, displayedSections, interval, initialFilterQuery, sections, sectionId }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = React.useState(false);

  const hasCharts = sections?.some((section) => section.charts.length > 0);
  const hasDisplayedCharts = displayedSections?.some((section) => section.charts.length > 0);
  const sectionRef = React.useRef<HTMLUListElement | null>(null);

  const shouldScrollToSection = Boolean(initialFilterQuery);

  React.useEffect(() => {
    if (shouldScrollToSection) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ shouldScrollToSection ]);

  const { chain } = useMultichainContext() || {};
  const isGasTrackerEnabled = config.features.gasTracker.isEnabled;

  const homeStatsQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isGasTrackerEnabled,
    },
  });

  const handleChartLoadingError = React.useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  if (isError) {
    return <ChainStatsErrorAlert/>;
  }

  if (!hasDisplayedCharts) {
    const selectedSection = sections?.find((section) => section.id === sectionId);
    return (
      <EmptyState
        type={ hasCharts ? 'query' : 'stats' }
        term={ hasCharts ? 'chart' : selectedSection?.title }
      />
    );
  }

  return (
    <Box>
      { isSomeChartLoadingError && (
        <ChainStatsErrorAlert/>
      ) }

      <section ref={ sectionRef }>
        {
          displayedSections?.map((section) => (
            <Box
              key={ section.id }
              mb={{ base: 6, lg: 8 }}
              _last={{
                marginBottom: 0,
              }}
            >
              <Skeleton loading={ isLoading } mb={{ base: 3, lg: 4 }} display="inline-flex" alignItems="center" columnGap={ 2 } id={ section.id }>
                <Heading level="2" id={ section.id }>
                  { section.title }
                </Heading>
                { isGasTrackerEnabled && section.id === 'gas' && homeStatsQuery.data && homeStatsQuery.data.gas_prices && (
                  <GasInfoTooltip data={ homeStatsQuery.data } dataUpdatedAt={ homeStatsQuery.dataUpdatedAt }>
                    <IconSvg name="info" boxSize={ 5 } display="block" cursor="pointer" color="icon.secondary" _hover={{ color: 'hover' }}/>
                  </GasInfoTooltip>
                ) }
              </Skeleton>

              <Grid
                templateColumns={{ lg: 'repeat(2, minmax(0, 1fr))' }}
                gap={{ base: 3, lg: 4 }}
              >
                { section.charts.map((chart) => {

                  const crossChainTxsChart = CROSS_CHAIN_TXS_CHARTS.find(({ id }) => id === chart.id);
                  if (crossChainTxsChart) {
                    return (
                      <ChartWidgetContainerCrossChain
                        key={ crossChainTxsChart.id }
                        id={ crossChainTxsChart.id }
                        title={ crossChainTxsChart.title }
                        description={ crossChainTxsChart.description }
                        interval={ interval }
                        isLoading={ isLoading }
                        onLoadingError={ handleChartLoadingError }
                        href={{ pathname: '/stats/[id]', query: { id: crossChainTxsChart.id, ...(chain?.id ? { chain_id: chain.id } : {}) } }}
                      />
                    );
                  }

                  return (
                    <ChartWidgetContainer
                      key={ chart.id }
                      id={ chart.id }
                      title={ chart.title }
                      description={ chart.description }
                      interval={ interval }
                      isLoading={ isLoading }
                      onLoadingError={ handleChartLoadingError }
                      href={{ pathname: '/stats/[id]', query: { id: chart.id, ...(chain?.id ? { chain_id: chain.id } : {}) } }}
                    />
                  );
                }) }
              </Grid>
            </Box>
          ))
        }
      </section>
    </Box>
  );
};

export default ChainStatsSections;
