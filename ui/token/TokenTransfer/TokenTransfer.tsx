import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';

import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenTransferList from 'ui/token/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/token/TokenTransfer/TokenTransferTable';

type Props = {
  transfersQuery: QueryWithPagesResult<'token_transfers'> | QueryWithPagesResult<'token_instance_transfers'>;
  tokenId?: string;
  token?: TokenInfo;
}

const TokenTransfer = ({ transfersQuery, tokenId, token }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { isError, isPlaceholderData, data, pagination } = transfersQuery;

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

  const content = data?.items ? (

    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TokenTransferTable
          data={ data?.items }
          top={ pagination.isVisible ? 80 : 0 }
          showSocketInfo={ pagination.page === 1 }
          socketInfoAlert={ socketAlert }
          socketInfoNum={ newItemsCount }
          tokenId={ tokenId }
          token={ token }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }}>
        { pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            url={ window.location.href }
            num={ newItemsCount }
            alert={ socketAlert }
            type="token_transfer"
            isLoading={ isPlaceholderData }
          />
        ) }
        <TokenTransferList data={ data?.items } tokenId={ tokenId } isLoading={ isPlaceholderData }/>
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
      isError={ isError }
      items={ data?.items }
      emptyText="There are no token transfers."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(TokenTransfer);
