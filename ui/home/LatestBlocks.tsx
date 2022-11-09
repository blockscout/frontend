import { Box, Heading, Link, Text, VStack, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const fetch = useFetch();
  const { data, isLoading, isError } = useQuery<unknown, unknown, Array<Block>>(
    [ QueryKeys.indexBlocks ],
    async() => await fetch(`/api/index/blocks`),
  );

  const queryClient = useQueryClient();

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.indexBlocks ], (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      return [ payload.block, ...newData ].slice(0, 4);
    });
  }, [ queryClient ]);

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
        { Array.from(Array(4)).map((item, index) => {
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
    // ???
    content = null;
  }

  if (data) {
    content = (
      <>
        <Box mb={ 9 }>
          <Text as="span" fontSize="sm">
        Network utilization:{ nbsp }
          </Text>
          { /* Not implemented in API yet */ }
          <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 700 }>
        43.8%
          </Text>
        </Box>
        <VStack spacing={ 6 } mb={ 6 }>
          <AnimatePresence initial={ false }>
            { data.map((block => <LatestBlocksItem key={ block.height } block={ block }/>)) }
          </AnimatePresence>
        </VStack>
      </>
    );
  }

  return (
    <Box width="280px">
      <Heading as="h4" fontSize="18px" mb={ 8 }>Latest Blocks</Heading>
      { content }
      <Link fontSize="sm">View all blocks</Link>
    </Box>
  );
};

export default LatestBlocks;
