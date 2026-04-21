import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ChainStatsChart, StatsIntervalIds } from '../../types/client';
import type { SankeyChartData } from 'toolkit/components/charts/sankey/types';

import { SankeyChartMenu } from 'toolkit/components/charts/sankey/parts/SankeyChartMenu';
import { SankeyChartContent } from 'toolkit/components/charts/sankey/SankeyChartContent';

import ChartIntervalSelect from '../../components/ChartIntervalSelect';

interface Props {
  chart: ChainStatsChart;
  data?: SankeyChartData;
  isLoading: boolean;
  isError: boolean;
  isInitialLoading: boolean;
  interval: StatsIntervalIds;
  onIntervalChange: (interval: StatsIntervalIds) => void;
}

const ChainStatsDetailsCrossChainTxsPaths = ({ chart, data, isLoading, isError, isInitialLoading, interval, onIntervalChange }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // FIXME: currently API supports only one chain, so we don't need to show chain select
  //   const chainsQuery = useApiQuery('interchainIndexer:chains');

  //   const chainsConfig = React.useMemo(() => {
  //     return chainsQuery.data?.items
  //       .filter((chain) => chain.id !== config.chain.id)
  //       .map((chain) => ({
  //         id: chain.id,
  //         name: chain.name,
  //         logo: chain.logo,
  //         explorer_url: chain.explorer_url,
  //       })) || [];
  //   }, [ chainsQuery.data ]);

  //   const chainSelect = (
  //     <ChainSelect
  //       chainsConfig={ chainsConfig }
  //       withAllOption
  //       loading={ chainsQuery.isLoading }
  //     />
  //   );

  //   const chainFilter = (() => {
  //     const chainNameElement = <chakra.span fontWeight="medium">{ config.chain.name }</chakra.span>;
  //     if (chart.id === 'outgoing-messages-paths') {
  //       return (
  //         <HStack>
  //           <span>From { chainNameElement } to</span>
  //           { chainSelect }
  //         </HStack>
  //       );
  //     }

  //     if (chart.id === 'incoming-messages-paths') {
  //       return (
  //         <HStack>
  //           { chainSelect }
  //           <span>to { chainNameElement }</span>
  //         </HStack>
  //       );
  //     }

  //     return null;
  //   })();

  //   const isOutgoing = chart.id === 'outgoing-messages-paths';
  //   const txnsCount = data?.links?.reduce((acc, link) => acc + link.value, 0) || 0;

  return (
    <>
      <Flex alignItems="flex-start" justifyContent="space-between" textStyle="sm">
        <Flex flexDir={{ base: 'column', lg: 'row' }} alignItems={{ base: 'flex-start', lg: 'center' }} gap={{ base: 2, lg: 6 }} maxW="100%">
          <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange } isLoading={ isInitialLoading }/>
          { /* { chainFilter } */ }
        </Flex>
        { data && (
          <SankeyChartMenu
            data={ data }
            title={ chart.title }
            description={ chart.description }
            isLoading={ isLoading }
            chartRef={ ref }
            chartUrl={ window.location.href }
          />
        ) }
      </Flex>
      { /* <VStack gap={ 1 } color="text.secondary" textStyle="xs" alignItems="flex-start" mt={{ base: 3, lg: 6 }}>
        <Text>
          <chakra.span fontWeight="semibold">Source </chakra.span>
          <span>{ isOutgoing ? config.chain.name : 'BAR' }</span>
        </Text>
        <Text>
          <chakra.span fontWeight="semibold">Destination </chakra.span>
          <span>{ isOutgoing ? 'BAR' : config.chain.name }</span>
        </Text>
        <Text>
          <chakra.span fontWeight="semibold">Txns { isOutgoing ? 'sent' : 'received' } </chakra.span>
          <span>{ Number(txnsCount).toLocaleString() }</span>
        </Text>
      </VStack> */ }
      <Flex
        ref={ ref }
        flexGrow={ 1 }
        h="50vh"
        mt={ 3 }
        position="relative"
      >
        <SankeyChartContent
          data={ data }
          isLoading={ isLoading }
          isError={ isError }
        />
      </Flex>
    </>
  );
};

export default React.memo(ChainStatsDetailsCrossChainTxsPaths);
