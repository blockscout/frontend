// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import getChainUtilizationParams from 'src/slices/chain/get-chain-utilization-params';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import config from 'src/config';
import ApiDegradationRpcIcon from 'src/shared/api-degradation/ApiDegradationRpcIcon';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import useInitialList from 'src/shared/lists/useInitialList';

import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

import LatestBlocksDegraded from './LatestBlocksDegraded';
import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.slices.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { blocksQuery } = useHomeDataContext();
  const initialList = useInitialList<schemas['Block']>({
    data: blocksQuery?.data ?? [],
    idFn: (block) => block.height,
    enabled: Boolean(blocksQuery && !blocksQuery.isPlaceholderData),
  });

  const statsQueryResult = useStatsQuery();

  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-blocks');

  const content = (() => {
    if (blocksQuery?.isError) {
      return <LatestBlocksDegraded maxNum={ blocksMaxCount }/>;
    }
    if (blocksQuery?.data && blocksQuery.data.length > 0) {
      const dataToShow = blocksQuery.data.slice(0, blocksMaxCount);

      return (
        <>
          <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (blocksQuery.isPlaceholderData ? String(index) : '') }
                block={ block }
                isLoading={ blocksQuery.isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            ))) }
          </VStack>
          <Flex justifyContent="center">
            <Link textStyle="sm" href={ route({ pathname: '/blocks' }) } loading={ blocksQuery.isPlaceholderData }>View all blocks</Link>
          </Flex>
        </>
      );
    }
    return <Box textStyle="sm">No latest blocks found.</Box>;
  })();

  const networkUtilization = getChainUtilizationParams(statsQueryResult.data?.network_utilization_percentage ?? 0);

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <HStack alignItems="center">
        <Heading level="3">Latest blocks</Heading>
        { isRpcData && <ApiDegradationRpcIcon/> }
      </HStack>
      { typeof statsQueryResult.data?.network_utilization_percentage === 'number' && (
        <Skeleton loading={ statsQueryResult.isPlaceholderData } mt={ 2 } display="inline-block" textStyle="sm">
          <Text as="span">
            Network utilization:{ nbsp }
          </Text>
          <Tooltip content={ `${ upperFirst(networkUtilization.load) } load` }>
            <Text as="span" color={ networkUtilization.color } fontWeight={ 700 }>
              { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
            </Text>
          </Tooltip>
        </Skeleton>
      ) }
      { statsQueryResult.data?.celo && (
        <Box whiteSpace="pre-wrap" textStyle="sm" mt={ 2 }>
          <span>Current epoch: </span>
          <chakra.span fontWeight={ 700 }>#{ statsQueryResult.data.celo.epoch_number }</chakra.span>
        </Box>
      ) }
      <Box mt={ 3 }>
        { content }
      </Box>
    </Box>
  );
};

export default LatestBlocks;
