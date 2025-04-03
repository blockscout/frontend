import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { ZKEVM_L2_TXN_BATCHES_ITEM } from 'stubs/zkEvmL2';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';

import LatestBatchItem from './LatestBatchItem';

const LatestZkEvmL2Batches = () => {
  const isMobile = useIsMobile();
  const batchesMaxCount = isMobile ? 2 : 5;
  const queryClient = useQueryClient();

  const { data, isPlaceholderData, isError } = useApiQuery('homepage_zkevm_l2_batches', {
    queryOptions: {
      placeholderData: { items: Array(batchesMaxCount).fill(ZKEVM_L2_TXN_BATCHES_ITEM) },
    },
  });

  const initialList = useInitialList({
    data: data?.items ?? [],
    idFn: (batch) => batch.number,
    enabled: !isPlaceholderData,
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
    content = <Text>No data. Please reload the page.</Text>;
  }

  if (data) {
    const dataToShow = data.items.slice(0, batchesMaxCount);

    content = (
      <>
        <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
          { dataToShow.map(((batch, index) => {
            const status = <ZkEvmL2TxnBatchStatus status={ batch.status } isLoading={ isPlaceholderData }/>;
            return (
              <LatestBatchItem
                key={ batch.number + (isPlaceholderData ? String(index) : '') }
                number={ batch.number }
                txCount={ batch.transaction_count }
                timestamp={ batch.timestamp }
                status={ status }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(batch) }
              />
            );
          })) }
        </VStack>
        <Flex justifyContent="center">
          <Link textStyle="sm" href={ route({ pathname: '/batches' }) }>View all batches</Link>
        </Flex>
      </>
    );
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Heading level="3" mb={ 3 }>Latest batches</Heading>
      { content }
    </Box>
  );
};

export default LatestZkEvmL2Batches;
