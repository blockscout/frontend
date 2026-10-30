// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Box, Flex, VStack } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import ChainUtilization from 'src/slices/chain/ChainUtilization';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import useInitialList from 'src/shared/lists/useInitialList';

import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';

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
  const { blocksQuery, blocksSocket } = useHomeDataContext();
  const initialList = useInitialList<schemas['Block']>({
    data: blocksQuery?.data ?? [],
    idFn: (block) => block.height,
    enabled: Boolean(blocksQuery && !blocksQuery.isPlaceholderData),
  });

  const statsQueryResult = useStatsQuery();

  const hasNewBlocksNotice = Boolean(blocksSocket && (blocksSocket.newBlocksCount > 0 || blocksSocket.showSocketErrorAlert));
  const newBlocksNotice = hasNewBlocksNotice && blocksQuery && (
    <SocketNewItemsNotice
      type="block"
      url={ route({ pathname: '/blocks' }) }
      num={ blocksSocket?.newBlocksCount }
      showErrorAlert={ blocksSocket?.showSocketErrorAlert }
      isLoading={ blocksQuery.isPlaceholderData }
      mb={ 2 }
      borderBottomRadius={ 0 }
    />
  );

  const content = (() => {
    if (blocksQuery?.isError) {
      return <LatestBlocksDegraded maxNum={ blocksMaxCount }/>;
    }
    if (blocksQuery?.data && blocksQuery.data.length > 0) {
      const dataToShow = blocksQuery.data.slice(0, blocksMaxCount);

      return (
        <>
          { newBlocksNotice }
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
    return (
      <>
        { newBlocksNotice }
        <Box textStyle="sm">No latest blocks found.</Box>
      </>
    );
  })();

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 2 }>
        <Heading level="3">Latest blocks</Heading>
        <ChainUtilization/>
      </Flex>
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
