// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';
import type { TokenInfo, TokenInstance } from 'client/slices/token/types/api';

import type { ResourceError } from 'client/api/resources';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import TokenTransferList from 'client/slices/token-transfer/pages/token/TokenTransferList';
import TokenTransferTable from 'client/slices/token-transfer/pages/token/TokenTransferTable';

import TokenAdvancedFilterLink from 'client/features/advanced-filter/pages/token/TokenAdvancedFilterLink';

import useGradualIncrement from 'client/shared/hooks/useGradualIncrement';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import useIsMounted from 'client/shared/hooks/useIsMounted';

import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

const TABS_HEIGHT = 88;

type Props = {
  transfersQuery: QueryWithPagesResult<'general:token_transfers'> | QueryWithPagesResult<'general:token_instance_transfers'>;
  tokenId?: string;
  tokenInstance?: TokenInstance;
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
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
    <DataListDisplay
      isError={ isError || isTokenError }
      itemsNum={ data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TokenTransfer);
