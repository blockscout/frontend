import { IconButton, Popover, PopoverTrigger, PopoverContent, PopoverBody, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { IndexingStatus } from 'types/api/indexingStatus';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { apos, nbsp, ndash } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import IconSvg from 'ui/shared/IconSvg';

const IntTxsIndexingStatus = () => {

  const { data, isError, isPending } = useApiQuery('homepage_indexing_status');

  const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const hintTextcolor = useColorModeValue('black', 'white');

  const queryClient = useQueryClient();

  const handleInternalTxsIndexStatus: SocketMessage.InternalTxsIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_indexing_status'), (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing = payload.finished;
      newData.indexed_internal_transactions_ratio = payload.ratio;

      return newData;
    });
  }, [ queryClient ]);

  const internalTxsIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing_internal_transactions',
    isDisabled: !data || data.finished_indexing,
  });

  useSocketMessage({
    channel: internalTxsIndexingChannel,
    event: 'internal_txs_index_status',
    handler: handleInternalTxsIndexStatus,
  });

  if (isError || isPending) {
    return null;
  }

  if (data.finished_indexing !== false) {
    return null;
  }

  const hint = (
    <Text fontSize="xs" color={ hintTextcolor }>
      { data.indexed_internal_transactions_ratio &&
        `${ Math.floor(Number(data.indexed_internal_transactions_ratio) * 100) }% Blocks With Internal Transactions Indexed${ nbsp }${ ndash } ` }
      We{ apos }re indexing this chain right now. Some of the counts may be inaccurate.
    </Text>
  );

  const trigger = (
    <Flex
      px={ 2 }
      py={ 1 }
      bg={ bgColor }
      borderRadius="base"
      alignItems="center"
      justifyContent="center"
      color="green.400"
      _hover={{ color: 'blue.400' }}
    >
      <IconButton
        colorScheme="none"
        aria-label="hint"
        icon={ <IconSvg name="info" boxSize={ 5 }/> }
        boxSize={ 6 }
        variant="simple"
      />
      { data.indexed_internal_transactions_ratio && (
        <Text fontWeight={ 600 } fontSize="xs" color="inherit">
          { Math.floor(Number(data.indexed_internal_transactions_ratio) * 100) + '%' }
        </Text>
      ) }
    </Flex>
  );

  return (
    <Popover placement="bottom-start" isLazy trigger="hover">
      <PopoverTrigger>
        { trigger }
      </PopoverTrigger>
      <PopoverContent maxH="450px" overflowY="hidden" w="240px">
        <PopoverBody p={ 4 } bgColor={ bgColor } boxShadow="2xl">
          { hint }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default IntTxsIndexingStatus;
