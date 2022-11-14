import { Box, Heading, Flex, Link, Text, VStack, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import LatestBlocksItem from './LatestBlocksItem';

const BLOCK_HEIGHT = 166;
const BLOCK_MARGIN = 24;

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  const blocksCount = isMobile ? 2 : 4;
  const fetch = useFetch();
  const { data, isLoading, isError } = useQuery<unknown, unknown, Array<Block>>(
    [ QueryKeys.indexBlocks ],
    async() => await fetch(`/api/index/blocks`),
  );

  const queryClient = useQueryClient();

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.indexBlocks ], (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      return [ payload.block, ...newData ].slice(0, blocksCount);
    });
  }, [ queryClient, blocksCount ]);

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

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  if (isLoading) {
    content = (
      <>
        <Skeleton w="100%" h={ 6 } mb={ 9 }/>
        { Array.from(Array(blocksCount)).map((item, index) => {
          return (
            <Box
              key={ index }
              width="100%"
              borderRadius="12px"
              border="1px solid"
              borderColor={ borderColor }
              p={ 6 }
              mb={ 6 }
            >
              <Skeleton w="100%" h="30px" mb={ 3 }/>
              <Skeleton w="100%" h="21px" mb={ 2 }/>
              <Skeleton w="100%" h="21px" mb={ 2 }/>
              <Skeleton w="100%" h="21px"/>
            </Box>
          );
        }) }
      </>
    );
  }

  if (isError) {
    content = <Text>There are no blocks yet.</Text>;
  }

  if (data) {
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
            { data.slice(0, blocksCount).map((block => <LatestBlocksItem key={ block.height } block={ block } h={ BLOCK_HEIGHT }/>)) }
          </AnimatePresence>
        </VStack>
      </>
    );
  }

  return (
    <>
      <Heading as="h4" fontSize="18px" mb={{ base: 3, lg: 8 }}>Latest Blocks</Heading>
      { content }
      <Flex justifyContent={{ base: 'center', lg: 'start' }}><Link fontSize="sm">View all blocks</Link></Flex>
    </>
  );
};

export default LatestBlocks;
