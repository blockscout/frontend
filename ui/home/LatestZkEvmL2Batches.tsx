import { Box, Heading, Flex, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2TxnBatches';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { ZKEVM_L2_TXN_BATCHES_ITEM } from 'stubs/zkEvmL2';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestZkevmL2BatchItem from './LatestZkevmL2BatchItem';

const LatestZkEvmL2Batches = () => {
  const isMobile = useIsMobile();
  const batchesMaxCount = isMobile ? 2 : 5;
  const queryClient = useQueryClient();

  const { data, isPlaceholderData, isError } = useApiQuery('homepage_zkevm_l2_batches', {
    queryOptions: {
      placeholderData: { items: Array(batchesMaxCount).fill(ZKEVM_L2_TXN_BATCHES_ITEM) },
    },
  });

  const handleNewBatchMessage: SocketMessage.NewZkEvmL2Batch['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_zkevm_l2_batches'), (prevData: { items: Array<ZkEvmL2TxnBatchesItem> } | undefined) => {
      const newItems = prevData?.items ? [ ...prevData.items ] : [];

      if (newItems.some((batch => batch.number === payload.batch.number))) {
        return { items: newItems };
      }

      return { items: [ payload.batch, ...newItems ].sort((b1, b2) => b2.number - b1.number).slice(0, batchesMaxCount) };
    });
  }, [ queryClient, batchesMaxCount ]);

  const channel = useSocketChannel({
    topic: 'zkevm_batches:new_zkevm_confirmed_batch',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_zkevm_confirmed_batch',
    handler: handleNewBatchMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload page.</Text>;
  }

  if (data) {
    const dataToShow = data.items.slice(0, batchesMaxCount);

    content = (
      <>
        <VStack spacing={ 3 } mb={ 4 } overflow="hidden" alignItems="stretch">
          <AnimatePresence initial={ false } >
            { dataToShow.map(((batch, index) => (
              <LatestZkevmL2BatchItem
                key={ batch.number + (isPlaceholderData ? String(index) : '') }
                batch={ batch }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </AnimatePresence>
        </VStack>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={ route({ pathname: '/zkevm-l2-txn-batches' }) }>View all batches</LinkInternal>
        </Flex>
      </>
    );
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Heading as="h4" size="sm" mb={ 4 }>Latest batches</Heading>
      { content }
    </Box>
  );
};

export default LatestZkEvmL2Batches;
