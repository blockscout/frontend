import { Alert, Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { BlockType, BlocksResponse } from 'types/api/block';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import BlocksList from 'ui/blocks/BlocksList';
import BlocksTable from 'ui/blocks/BlocksTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';

type QueryResult = UseQueryResult<BlocksResponse> & {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
};

interface Props {
  type?: BlockType;
  query: QueryResult;
}

const BlocksContent = ({ type, query }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('blocks', { queryParams: { type } });

    queryClient.setQueryData(queryKey, (prevData: BlocksResponse | undefined) => {
      const shouldAddToList = !type || type === payload.block.type;

      if (!prevData) {
        return {
          items: shouldAddToList ? [ payload.block ] : [],
          next_page_params: null,
        };
      }

      if (!shouldAddToList || prevData.items.some((block => block.height === payload.block.height))) {
        return prevData;
      }

      const newItems = [ payload.block, ...prevData.items ].sort((b1, b2) => b2.height - b1.height);
      return { ...prevData, items: newItems };
    });
  }, [ queryClient, type ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please click here to load new blocks.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new blocks. Please click here to refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: query.isPlaceholderData || query.isError || query.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const content = query.data?.items ? (
    <>
      { socketAlert && <Alert status="warning" mb={ 6 } as="a" href={ window.document.location.href }>{ socketAlert }</Alert> }
      <Box display={{ base: 'block', lg: 'none' }}>
        <BlocksList data={ query.data.items } isLoading={ query.isPlaceholderData } page={ query.pagination.page }/>
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <BlocksTable data={ query.data.items } top={ query.isPaginationVisible ? 80 : 0 } page={ query.pagination.page } isLoading={ query.isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const actionBar = isMobile && query.isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      isLoading={ false }
      items={ query.data?.items }
      skeletonProps={{ skeletonDesktopColumns: [ '125px', '120px', '21%', '64px', '35%', '22%', '22%' ] }}
      emptyText="There are no blocks."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(BlocksContent);
