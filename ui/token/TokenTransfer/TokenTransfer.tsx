import { Hide, Show, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/tokenInfo';
import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferList from 'ui/token/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/token/TokenTransfer/TokenTransferTable';

type Props = {
  token?: TokenInfo;
  transfersQuery: UseQueryResult<TokenTransferResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenTransfer = ({ transfersQuery, token }: Props) => {
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

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '45%', '15%', '36px', '15%', '25%' ] }
            />
          </Hide>
          <Show below="lg" ssr={ false }>
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length) {
      return <Text as="span">There are no token transfers</Text>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg" ssr={ false }>
          <TokenTransferTable
            data={ items }
            top={ 80 }
            // token transfers query depends on token data
            // so if we are here, we definitely have token data
            token={ token as TokenInfo }
            showSocketInfo={ pagination.page === 1 }
            socketInfoAlert={ socketAlert }
            socketInfoNum={ newItemsCount }
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
          <TokenTransferList data={ items }/>
        </Show>
      </>
    );
  })();

  return (
    <>
      { isMobile && isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default React.memo(TokenTransfer);
