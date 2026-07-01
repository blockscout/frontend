// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack, VStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ChainStatsChart, StatsIntervalIds } from 'src/features/chain-stats/types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { SankeyChartData } from 'src/toolkit/components/charts/sankey/types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ChartIntervalSelect from 'src/features/chain-stats/components/ChartIntervalSelect';
import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelectMultichain from 'src/features/multichain/components/ChainSelect';
import type useRoutedChainSelect from 'src/features/multichain/hooks/useRoutedChainSelect';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import ChainSelect, { isAllOption } from 'src/shared/external-chains/ChainSelect';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { SankeyChartMenu } from 'src/toolkit/components/charts/sankey/parts/SankeyChartMenu';
import { SankeyChartContent } from 'src/toolkit/components/charts/sankey/SankeyChartContent';

interface Props {
  chart: ChainStatsChart;
  data?: SankeyChartData;
  baseChain?: ClusterChainConfig;
  baseChainSelectProps?: ReturnType<typeof useRoutedChainSelect>;
  isLoading: boolean;
  isError: boolean;
  isInitialLoading: boolean;
  interval: StatsIntervalIds;
  onIntervalChange: (interval: StatsIntervalIds) => void;
  counterPartyChainIds: Array<string>;
  onCounterPartyChainIdsChange: OnValueChangeHandler;
}

const ChainStatsDetailsCrossChainTxs = ({
  chart,
  data,
  baseChain,
  baseChainSelectProps,
  isLoading,
  isError,
  isInitialLoading,
  interval,
  onIntervalChange,
  counterPartyChainIds,
  onCounterPartyChainIdsChange,
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const chainsQuery = useApiQuery('interchainIndexer:chains');

  const handleShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: chart.id });
  }, [ chart.id ]);

  const counterPartyChainsConfig = React.useMemo(() => {
    return chainsQuery.data?.items
      .filter((chain) => chain.id !== (baseChain?.app_config ?? config).chain.id)
      .map((chain) => ({
        id: chain.id,
        name: chain.name,
        logo: chain.logo,
        explorer_url: chain.explorer_url,
      })) || [];
  }, [ baseChain?.app_config, chainsQuery.data?.items ]);

  const baseChainIds = React.useMemo(() => {
    return multichainConfig()?.chains
      .filter((chain) => chain.app_config.features.crossChainTxs.isEnabled)
      .map((chain) => chain.id);
  }, []);

  const chainFilter = (() => {
    const counterPartyChainSelect = (
      <ChainSelect
        value={ counterPartyChainIds }
        onValueChange={ onCounterPartyChainIdsChange }
        chainsConfig={ counterPartyChainsConfig }
        withAllOption
        loading={ chainsQuery.isLoading }
        multiple
      />
    );

    const baseChainSelect = baseChainSelectProps ? (
      <ChainSelectMultichain
        value={ baseChainSelectProps.value }
        onValueChange={ baseChainSelectProps.onValueChange }
        loading={ chainsQuery.isLoading }
        chainIds={ baseChainIds }
      />
    ) : null;

    const chainName = <chakra.span fontWeight="medium" color="text.primary">{ (baseChain?.app_config ?? config).chain.name }</chakra.span>;

    if (chart.id === 'outgoing-messages-paths') {
      if (baseChainSelect) {
        return (
          <HStack>
            { baseChainSelect }
            <span>to</span>
            { counterPartyChainSelect }
          </HStack>
        );
      }

      return (
        <HStack color="text.secondary">
          <Skeleton loading={ isInitialLoading }>
            <span>From { chainName } to </span>
          </Skeleton>
          { counterPartyChainSelect }
        </HStack>
      );
    }

    if (chart.id === 'incoming-messages-paths') {
      if (baseChainSelect) {
        return (
          <HStack>
            { counterPartyChainSelect }
            <span>to</span>
            { baseChainSelect }
          </HStack>
        );
      }

      return (
        <HStack color="text.secondary">
          { counterPartyChainSelect }
          <Skeleton loading={ isInitialLoading }>
            <span>to { chainName }</span>
          </Skeleton>
        </HStack>
      );
    }

    return null;
  })();

  const counterPartyChainNames = (() => {
    if (isAllOption(counterPartyChainIds)) {
      return 'All chains';
    }

    return counterPartyChainIds.map((chainId) => {
      return counterPartyChainsConfig.find((chain) => chain.id === chainId)?.name || `Chain ${ chainId }`;
    }).join(', ');
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
            isLoading={ isInitialLoading || isLoading }
            chartRef={ ref }
            chartUrl={ window.location.href }
            onShare={ handleShare }
          />
        ) }
      </Flex>
      <VStack gap={ 1 } color="text.secondary" textStyle="xs" alignItems="flex-start" mt={{ base: 3, lg: 6 }}>
        <Skeleton loading={ isInitialLoading }>
          <chakra.span fontWeight="semibold">Source </chakra.span>
          <span>{ isOutgoing ? (baseChain?.app_config ?? config).chain.name : counterPartyChainNames }</span>
        </Skeleton>
        <Skeleton loading={ isInitialLoading }>
          <chakra.span fontWeight="semibold">Destination </chakra.span>
          <span>{ isOutgoing ? counterPartyChainNames : (baseChain?.app_config ?? config).chain.name }</span>
        </Skeleton>
        <Skeleton loading={ isInitialLoading || isLoading }>
          <chakra.span fontWeight="semibold">Txns { isOutgoing ? 'sent' : 'received' } </chakra.span>
          <span>{ Number(txnsCount).toLocaleString() }</span>
        </Skeleton>
      </VStack>
      <Flex
        ref={ ref }
        flexGrow={ 1 }
        h="50vh"
        mt={ 3 }
        position="relative"
      >
        <SankeyChartContent
          data={ data }
          isLoading={ isInitialLoading || isLoading }
          isError={ isError }
        />
      </Flex>
    </>
  );
};

export default React.memo(ChainStatsDetailsCrossChainTxs);
