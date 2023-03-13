import { Hide, Show } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferList from 'ui/token/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/token/TokenTransfer/TokenTransferTable';

type Props = {
  transfersQuery: UseQueryResult<TokenTransferResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
  tokenId?: string;
}

const TokenTransfer = ({ transfersQuery, tokenId }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { isError, isLoading, data, pagination, isPaginationVisible } = transfersQuery;

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
    isDisabled: isLoading || isError || pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewTransfersMessage,
  });

  const items = data?.items?.reduce(flattenTotal, []);

  const content = items ? (

    <>
      <Hide below="lg" ssr={ false }>
        <TokenTransferTable
          data={ items }
          top={ isPaginationVisible ? 80 : 0 }
          showSocketInfo={ pagination.page === 1 }
          socketInfoAlert={ socketAlert }
          socketInfoNum={ newItemsCount }
          tokenId={ tokenId }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { pagination.page === 1 && (
          <SocketNewItemsNotice
            url={ window.location.href }
            num={ newItemsCount }
            alert={ socketAlert }
            type="token_transfer"
            borderBottomRadius={ 0 }
          />
        ) }
        <TokenTransferList data={ items } tokenId={ tokenId }/>
      </Show>
    </>
  ) : null;

  const actionBar = isMobile && isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data?.items }
      isLongSkeleton
      skeletonDesktopColumns={ [ '45%', '15%', '36px', '15%', '25%' ] }
      emptyText="There are no token transfers."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(TokenTransfer);
