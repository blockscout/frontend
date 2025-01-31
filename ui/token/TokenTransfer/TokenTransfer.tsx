import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';

import type { ResourceError } from 'lib/api/resources';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenTransferList from 'ui/token/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/token/TokenTransfer/TokenTransferTable';

const TABS_HEIGHT = 88;

type Props = {
  transfersQuery: QueryWithPagesResult<'token_transfers'> | QueryWithPagesResult<'token_instance_transfers'>;
  tokenId?: string;
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  shouldRender?: boolean;
};

const TokenTransfer = ({ transfersQuery, tokenId, tokenQuery, shouldRender = true }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const router = useRouter();
  const { isError, isPlaceholderData, data, pagination } = transfersQuery;
  const { data: token, isPlaceholderData: isTokenPlaceholderData, isError: isTokenError } = tokenQuery;

  const [ newItemsCount, setNewItemsCount ] = useGradualIncrement(0);
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const handleNewTransfersMessage: SocketMessage.TokenTransfers['handler'] = (payload) => {
    setNewItemsCount(payload.token_transfer);
  };

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please refresh the page to load new token transfers.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new token transfers. Please refresh the page.');
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
          top={ pagination.isVisible ? TABS_HEIGHT : 0 }
          showSocketInfo={ pagination.page === 1 }
          socketInfoAlert={ socketAlert }
          socketInfoNum={ newItemsCount }
          tokenId={ tokenId }
          token={ token }
          isLoading={ isLoading }
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }}>
        { pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            url={ window.location.href }
            num={ newItemsCount }
            alert={ socketAlert }
            type="token_transfer"
            isLoading={ isLoading }
          />
        ) }
        <TokenTransferList data={ data?.items } tokenId={ tokenId } isLoading={ isLoading }/>
      </Box>
    </>
  ) : null;

  const actionBar = isMobile && pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError || isTokenError }
      items={ data?.items }
      emptyText="There are no token transfers."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(TokenTransfer);
