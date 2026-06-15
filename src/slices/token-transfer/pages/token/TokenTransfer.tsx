// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import type { ResourceError } from 'src/api/resources';
import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenTransferList from 'src/slices/token-transfer/pages/token/TokenTransferList';
import TokenTransferTable from 'src/slices/token-transfer/pages/token/TokenTransferTable';

import TokenAdvancedFilterLink from 'src/features/advanced-filter/pages/token/TokenAdvancedFilterLink';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import useGradualIncrement from 'src/shared/numbers/useGradualIncrement';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

const TABS_HEIGHT = 88;

type Props = {
  transfersQuery: QueryWithPagesResult<'core:token_transfers'> | QueryWithPagesResult<'core:token_instance_transfers'>;
  tokenId?: string;
  tokenInstance?: schemas['TokenInstance'];
  tokenQuery: UseQueryResult<schemas['Token'], ResourceError<unknown>>;
  shouldRender?: boolean;
  tabsHeight?: number;
};

const TokenTransfer = ({ transfersQuery, tokenId, tokenQuery, tabsHeight = TABS_HEIGHT, tokenInstance, shouldRender = true }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const router = useRouter();
  const { isError, isPlaceholderData, data, pagination } = transfersQuery;
  const { data: token, isPlaceholderData: isTokenPlaceholderData, isError: isTokenError } = tokenQuery;

  const [ newItemsCount, setNewItemsCount ] = useGradualIncrement(0);
  const [ showSocketErrorAlert, setShowSocketErrorAlert ] = React.useState(false);

  const handleNewTransfersMessage: SocketMessage.TokenTransfers['handler'] = (payload) => {
    setNewItemsCount(payload.token_transfer);
  };

  const handleSocketClose = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const channel = useSocketChannel({
    topic: `tokens:${ router.query.hash?.toString().toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: isPlaceholderData || isError || pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewTransfersMessage,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const isLoading = isPlaceholderData || isTokenPlaceholderData;

  const content = data?.items && token ? (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TokenTransferTable
          data={ data?.items }
          top={ tabsHeight }
          showSocketInfo={ pagination.page === 1 }
          showSocketErrorAlert={ showSocketErrorAlert }
          socketInfoNum={ newItemsCount }
          tokenId={ tokenId }
          token={ token }
          instance={ tokenInstance }
          isLoading={ isLoading }
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }}>
        { pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            num={ newItemsCount }
            showErrorAlert={ showSocketErrorAlert }
            type="token_transfer"
            isLoading={ isLoading }
          />
        ) }
        <TokenTransferList data={ data?.items } tokenId={ tokenId } instance={ tokenInstance } isLoading={ isLoading }/>
      </Box>
    </>
  ) : null;

  const actionBar = isMobile && pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <TokenAdvancedFilterLink token={ token }/>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ isError || isTokenError }
      itemsNum={ data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TokenTransfer);
