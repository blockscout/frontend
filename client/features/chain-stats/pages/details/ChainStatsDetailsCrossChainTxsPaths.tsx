import { Flex, HStack, VStack, chakra, Text } from '@chakra-ui/react';
import React from 'react';

import type { ChainStatsChart, StatsIntervalIds } from '../../types/client';
import type { SankeyChartData } from 'toolkit/components/charts/sankey/types';

import config from 'configs/app';
import { SankeyChartMenu } from 'toolkit/components/charts/sankey/parts/SankeyChartMenu';
import { SankeyChartContent } from 'toolkit/components/charts/sankey/SankeyChartContent';
import ChainSelect from 'ui/shared/externalChains/ChainSelect';

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

  const chainSelect = (
    <ChainSelect
      chainsConfig={ [] }
      withAllOption
    />
  );

  const chainFilter = (() => {
    const chainNameElement = <chakra.span fontWeight="medium">{ config.chain.name }</chakra.span>;
    if (chart.id === 'outgoing-messages-paths') {
      return (
        <HStack>
          <span>From { chainNameElement } to</span>
          { chainSelect }
        </HStack>
      );
    }

    if (chart.id === 'incoming-messages-paths') {
      return (
        <HStack>
          { chainSelect }
          <span>to { chainNameElement }</span>
        </HStack>
      );
    }

    return null;
  })();

  const isOutgoing = chart.id === 'outgoing-messages-paths';
  const txnsCount = data?.links?.reduce((acc, link) => acc + link.value, 0) || 0;

  return (
    <>
      <Flex alignItems="flex-start" justifyContent="space-between" textStyle="sm">
        <Flex flexDir={{ base: 'column', lg: 'row' }} alignItems={{ base: 'flex-start', lg: 'center' }} gap={{ base: 2, lg: 6 }} maxW="100%">
          <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange } isLoading={ isInitialLoading }/>
          { chainFilter }
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
      <VStack gap={ 1 } color="text.secondary" textStyle="xs" alignItems="flex-start" mt={{ base: 3, lg: 6 }}>
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
      </VStack>
      <Flex
        ref={ ref }
        flexGrow={ 1 }
        h="50vh"
        mt={ 2 }
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
