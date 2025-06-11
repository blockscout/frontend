import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';

import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { Heading } from 'toolkit/chakra/heading';

// TODO @tom2drum remove this component after testing
const HomeMultichainSocketTest = () => {
  const [ blocks, setBlocks ] = React.useState<Array<{ block_number: number; chain_id: number }>>([ ]);

  const handleNewBlockMessage: SocketMessage.NewBlockMultichain['handler'] = React.useCallback((payload) => {
    setBlocks((prev) => {
      const newBlocks = [ ...payload, ...prev ];
      const uniqueBlocks = newBlocks.filter((block, index, self) =>
        index === self.findIndex((t) => t.block_number === block.block_number),
      );

      return uniqueBlocks.slice(0, 5);
    });
  }, [ ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_blocks',
    isDisabled: false,
  });
  useSocketMessage({
    channel,
    event: 'new_blocks',
    handler: handleNewBlockMessage,
  });

  return (
    <>
      <Heading mt={ 6 }>Latest blocks from multichain socket</Heading>
      <VStack mt={ 2 } alignItems="flex-start">
        { blocks.length > 0 ? (
          blocks.map((block) => (
            <HStack key={ block.block_number }>
              <Box>Chain ID: { block.chain_id }</Box>
              <Box>Block number: { block.block_number }</Box>
            </HStack>
          ))
        ) : (
          <Box>No blocks yet</Box>
        ) }
      </VStack>
    </>
  );
};

export default React.memo(HomeMultichainSocketTest);
