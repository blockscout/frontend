import { Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { BlockType, BlocksResponse } from 'types/api/block';

import { route } from 'nextjs-routes';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import BlocksList from 'ui/blocks/BlocksList';
import BlocksTable from 'ui/blocks/BlocksTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

const OVERLOAD_COUNT = 75;
const TABS_HEIGHT = 88;

interface Props {
  type?: BlockType;
  query: QueryWithPagesResult<'blocks'> | QueryWithPagesResult<'optimistic_l2_txn_batch_blocks'>;
  enableSocket?: boolean;
  top?: number;
}

const BlocksContent = ({ type, query, enableSocket = true, top }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

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

      if (prevData.items.length >= OVERLOAD_COUNT) {
        setNewItemsCount(prev => prev + 1);
        return prevData;
      }

      const newItems = [ payload.block, ...prevData.items ].sort((b1, b2) => b2.height - b1.height);
      return { ...prevData, items: newItems };
    });
  }, [ queryClient, type ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please refresh the page to load new blocks.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new blocks. Please refresh the page to load new blocks.');
  }, []);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: query.isPlaceholderData || query.isError || query.pagination.page !== 1 || !enableSocket,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const content = query.data?.items ? (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        { query.pagination.page === 1 && enableSocket && (
          <SocketNewItemsNotice.Mobile
            url={ window.location.href }
            num={ newItemsCount }
            alert={ socketAlert }
            type="block"
            isLoading={ query.isPlaceholderData }
          />
        ) }
        <BlocksList data={ query.data.items } isLoading={ query.isPlaceholderData } page={ query.pagination.page }/>
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <BlocksTable
          data={ query.data.items }
          top={ top || (query.pagination.isVisible ? TABS_HEIGHT : 0) }
          page={ query.pagination.page }
          isLoading={ query.isPlaceholderData }
          showSocketInfo={ query.pagination.page === 1 && enableSocket }
          socketInfoNum={ newItemsCount }
          socketInfoAlert={ socketAlert }
        />
      </Box>
    </>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar mt={ -6 }>
      <LinkInternal display="inline-flex" alignItems="center" href={ route({ pathname: '/block/countdown' }) }>
        <IconSvg name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </LinkInternal>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      items={ query.data?.items }
      emptyText="There are no blocks."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(BlocksContent);
