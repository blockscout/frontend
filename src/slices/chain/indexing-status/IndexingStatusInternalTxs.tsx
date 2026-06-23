// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import config from 'src/config';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { apos, nbsp, ndash } from 'src/toolkit/utils/htmlEntities';

const IndexingStatusInternalTxs = () => {

  const { data, isError, isPending } = useApiQuery('core:homepage_indexing_status', {
    queryOptions: {
      enabled: !config.chain.indexingStatus.intTxs.isHidden,
    },
  });

  const queryClient = useQueryClient();

  const handleInternalTxsIndexStatus: SocketMessage.InternalTxsIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(
      getResourceKey('core:homepage_indexing_status'),
      (prevData: operations['MainPageController.indexing_status']['json'] | undefined) => {

        const newData = prevData ? {
          ...prevData,
          finished_indexing: payload.finished,
          indexed_internal_transactions_ratio: payload.ratio,
        } : undefined;

        return newData;
      });
  }, [ queryClient ]);

  const internalTxsIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing_internal_transactions',
    isDisabled: Boolean(!data || data.finished_indexing),
  });

  useSocketMessage({
    channel: internalTxsIndexingChannel,
    event: 'index_status',
    handler: handleInternalTxsIndexStatus,
  });

  if (isError || isPending) {
    return null;
  }

  if (data.finished_indexing !== false) {
    return null;
  }

  const hint = (
    <Text textStyle="xs">
      { data.indexed_internal_transactions_ratio &&
        `${ Math.floor(Number(data.indexed_internal_transactions_ratio) * 100) }% Blocks With Internal Transactions Indexed${ nbsp }${ ndash } ` }
      We{ apos }re indexing this chain right now. Some of the counts may be inaccurate.
    </Text>
  );

  const trigger = (
    <Flex
      px={ 1 }
      bg={{ base: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
      borderRadius="sm"
      alignItems="center"
      justifyContent="center"
      color="green.400"
      _hover={{ color: 'hover' }}
    >
      <SpriteIcon name="info" boxSize={ 5 }/>
      { data.indexed_internal_transactions_ratio && (
        <Text fontWeight={ 600 } textStyle="xs" color="inherit">
          { Math.floor(Number(data.indexed_internal_transactions_ratio) * 100) + '%' }
        </Text>
      ) }
    </Flex>
  );

  return (
    <Tooltip content={ hint } interactive positioning={{ placement: 'bottom-start' }} lazyMount>
      { trigger }
    </Tooltip>
  );
};

export default IndexingStatusInternalTxs;
