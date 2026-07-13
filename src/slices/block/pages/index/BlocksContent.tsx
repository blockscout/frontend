// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations, schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import { getResourceKey } from 'src/api/hooks/useApiQuery';
import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import BlocksList from 'src/slices/block/pages/index/BlocksList';
import BlocksTable from 'src/slices/block/pages/index/BlocksTable';

import { useMultichainContext } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';
import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

const OVERLOAD_COUNT = 75;
const TABS_HEIGHT = 88;

export interface Props {
  type?: schemas['BlockResponse']['type'];
  query: QueryWithPagesResult<'core:blocks'> | QueryWithPagesResult<'core:optimistic_l2_txn_batch_blocks'>;
  enableSocket?: boolean;
  top?: number;
}

const BlocksContent = ({ type, query, enableSocket = true, top }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const [ showSocketAlert, setShowSocketAlert ] = React.useState(false);

  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('core:blocks', {
      queryParams: { type },
      chainId: multichainContext?.chain?.id,
    });

    queryClient.setQueryData(queryKey, (prevData: operations['BlockController.blocks']['json'] | undefined) => {
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
  }, [ multichainContext?.chain?.id, queryClient, type ]);

  const handleNewBlockCountMessage: SocketMessage.NewBlockCount['handler'] = React.useCallback((payload) => {
    const listType = type ?? 'block';
    const payloadType = payload.type ?? 'block';
    if (payload.count > 0 && (listType === payloadType)) {
      setNewItemsCount((prev) => prev + payload.count);
    }
  }, [ type ]);

  const handleSocketClose = React.useCallback(() => {
    setShowSocketAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowSocketAlert(true);
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
  useSocketMessage({
    channel,
    event: 'new_blocks_count',
    handler: handleNewBlockCountMessage,
  });

  const chainData = multichainContext?.chain;

  const content = query.data?.items ? (
    <>
      <Box hideFrom="lg">
        { query.pagination.page === 1 && enableSocket && (
          <SocketNewItemsNotice.Mobile
            num={ newItemsCount }
            showErrorAlert={ showSocketAlert }
            type="block"
            isLoading={ query.isPlaceholderData }
          />
        ) }
        <BlocksList data={ query.data.items } isLoading={ query.isPlaceholderData } page={ query.pagination.page } chainData={ chainData }/>
      </Box>
      <Box hideBelow="lg">
        <BlocksTable
          data={ query.data.items }
          top={ top || (query.pagination.isVisible ? TABS_HEIGHT : 0) }
          page={ query.pagination.page }
          isLoading={ query.isPlaceholderData }
          showSocketInfo={ query.pagination.page === 1 && enableSocket }
          socketInfoNum={ newItemsCount }
          showSocketErrorAlert={ showSocketAlert }
          chainData={ chainData }
        />
      </Box>
    </>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar mt={ -6 }>
      <Link href={ route({ pathname: '/block/countdown' }, multichainContext) }>
        <SpriteIcon name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items?.length }
      emptyText="There are no blocks."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(BlocksContent);
