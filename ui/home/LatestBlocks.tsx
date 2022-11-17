import { Box, Heading, Flex, Link, Text, VStack, Skeleton } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import link from 'lib/link/link';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import LatestBlocksItem from './LatestBlocksItem';
import LatestBlocksItemSkeleton from './LatestBlocksItemSkeleton';

const BLOCK_HEIGHT = 166;
const BLOCK_MARGIN = 24;

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  const blocksMaxCount = isMobile ? 2 : 4;
  const fetch = useFetch();
  const { data, isLoading, isError } = useQuery<unknown, unknown, Array<Block>>(
    [ QueryKeys.indexBlocks ],
    async() => await fetch(`/api/index/blocks`),
  );

  const queryClient = useQueryClient();

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.indexBlocks ], (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      return [ payload.block, ...newData ].slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isLoading || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isLoading) {
    content = (
      <>
        <Skeleton w="100%" h={ 6 } mb={ 9 }/>
        <VStack
          spacing={ `${ BLOCK_MARGIN }px` }
          mb={ 6 }
          height={ `${ BLOCK_HEIGHT * blocksMaxCount + BLOCK_MARGIN * (blocksMaxCount - 1) }px` }
          overflow="hidden"
        >
          { Array.from(Array(blocksMaxCount)).map((item, index) => <LatestBlocksItemSkeleton key={ index }/>) }
        </VStack>
      </>
    );
  }

  if (isError) {
    content = <Text>There are no blocks yet.</Text>;
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);
    const blocksCount = dataToShow.length;

    content = (
      <>
        <Box mb={{ base: 6, lg: 9 }}>
          <Text as="span" fontSize="sm">
        Network utilization:{ nbsp }
          </Text>
          { /* Not implemented in API yet */ }
          <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 700 }>
        43.8%
          </Text>
        </Box>
        <VStack spacing={ `${ BLOCK_MARGIN }px` } mb={ 6 } height={ `${ BLOCK_HEIGHT * blocksCount + BLOCK_MARGIN * (blocksCount - 1) }px` } overflow="hidden">
          <AnimatePresence initial={ false } >
            { dataToShow.map((block => <LatestBlocksItem key={ block.height } block={ block } h={ BLOCK_HEIGHT }/>)) }
          </AnimatePresence>
        </VStack>
        <Flex justifyContent="center">
          <Link fontSize="sm" href={ link('blocks') }>View all blocks</Link>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Heading as="h4" fontSize="18px" mb={{ base: 3, lg: 8 }}>Latest Blocks</Heading>
      { content }
    </>
  );
};

export default LatestBlocks;
