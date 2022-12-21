import { Alert, AlertIcon, AlertTitle, chakra } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { IndexingStatus } from 'types/api/indexingStatus';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp, ndash } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

const IndexingAlert = ({ className }: { className?: string }) => {
  const fetch = useFetch();
  const isMobile = useIsMobile();

  const { data } = useQuery<unknown, unknown, IndexingStatus>(
    [ QueryKeys.indexingStatus ],
    async() => await fetch(`/node-api/index/indexing-status`),
  );

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.indexingStatus ], (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing_blocks = payload.finished;
      newData.indexed_blocks_ratio = payload.ratio;

      return newData;
    });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'block_index_status',
    handler: handleBlocksIndexStatus,
  });

  const handleIntermalTxsIndexStatus: SocketMessage.InternalTxsIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.indexingStatus ], (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing = payload.finished;
      newData.indexed_inernal_transactions_ratio = payload.ratio;

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
    handler: handleIntermalTxsIndexStatus,
  });

  if (!data) {
    return null;
  }

  let content;
  if (data.finished_indexing_blocks === false) {
    content = `${ data.indexed_blocks_ratio && `${ (Number(data.indexed_blocks_ratio) * 100).toFixed() }% Blocks Indexed${ nbsp }${ ndash } ` }
          We're indexing this chain right now. Some of the counts may be inaccurate.` ;
  } else if (data.finished_indexing === false) {
    content = `${ data.indexed_inernal_transactions_ratio &&
            `${ (Number(data.indexed_inernal_transactions_ratio) * 100).toFixed() }% Blocks With Internal Transactions Indexed${ nbsp }${ ndash } ` }
          We're indexing this chain right now. Some of the counts may be inaccurate.`;
  }

  if (!content) {
    return null;
  }

  return (
    <Alert status="warning" variant="solid" py={ 3 } borderRadius="12px" mb={ 6 } className={ className }>
      { !isMobile && <AlertIcon/> }
      <AlertTitle>
        { content }
      </AlertTitle>
    </Alert>
  );
};

export default chakra(IndexingAlert);
