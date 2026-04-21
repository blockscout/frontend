import { chakra, Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { nbsp } from 'toolkit/utils/htmlEntities';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';

import { useHomeBlocksQuery } from './blocksDataContext';
import LatestBlocksDegraded from './fallbacks/LatestBlocksDegraded';
import { useHomeRpcDataContext } from './fallbacks/rpcDataContext';
import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useHomeBlocksQuery();
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (block) => block.height,
    enabled: !isPlaceholderData,
  });

  const statsQueryResult = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-blocks');

  const content = (() => {
    if (isError) {
      return <LatestBlocksDegraded maxNum={ blocksMaxCount }/>;
    }
    if (data && data.length > 0) {
      const dataToShow = data.slice(0, blocksMaxCount);

      return (
        <>
          <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (isPlaceholderData ? String(index) : '') }
                block={ block }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            ))) }
          </VStack>
          <Flex justifyContent="center">
            <Link textStyle="sm" href={ route({ pathname: '/blocks' }) } loading={ isPlaceholderData }>View all blocks</Link>
          </Flex>
        </>
      );
    }
    return <Box textStyle="sm">No latest blocks found.</Box>;
  })();

  const networkUtilization = getNetworkUtilizationParams(statsQueryResult.data?.network_utilization_percentage ?? 0);

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <HStack alignItems="center">
        <Heading level="3">Latest blocks</Heading>
        { isRpcData && <FallbackRpcIcon/> }
      </HStack>
      { statsQueryResult.data?.network_utilization_percentage !== undefined && (
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
