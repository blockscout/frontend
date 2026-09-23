// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TokenTransferTable from 'src/slices/token-transfer/pages/token/TokenTransferTable';

import TokenAdvancedFilterLink from 'src/features/advanced-filter/pages/token/TokenAdvancedFilterLink';

import DataList from 'src/shared/lists/DataList';
import useGradualIncrement from 'src/shared/numbers/useGradualIncrement';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import { getTokenTransfersStub } from '../../stubs';

interface Props {
  token: schemas['Token'] | undefined;
  isLoading?: boolean;
  tokenId?: string;
  tokenInstance?: schemas['TokenInstance'];
};

const TokenTransfer = ({ tokenId, token, isLoading: isLoadingProp, tokenInstance }: Props) => {
  const [ newItemsCount, setNewItemsCount ] = useGradualIncrement(0);
  const [ showSocketErrorAlert, setShowSocketErrorAlert ] = React.useState(false);

  // The backend emits `token_transfer` events for the whole token, not per instance, so on the NFT
  // instance page they produce false "N more transfers" notices.
  // See https://github.com/blockscout/frontend/issues/3653
  const isSocketEnabled = !tokenId;

  const transfersQuery = useApiPaginatedQuery({
    resourceName: tokenId ? 'core:token_instance_transfers' : 'core:token_transfers',
    pathParams: { hash: token?.address_hash, id: tokenId },
    options: {
      enabled: !isLoadingProp && Boolean(token?.address_hash),
      placeholderData: getTokenTransfersStub(token?.type),
    },
  });

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
    topic: `tokens:${ token?.address_hash.toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: !isSocketEnabled || transfersQuery.isPlaceholderData || transfersQuery.isError || transfersQuery.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewTransfersMessage,
  });

  const isLoading = transfersQuery.isInitialLoading || isLoadingProp;

  const content = transfersQuery.data?.items && token ? (
    <TableContainerScrollable>
      <TokenTransferTable
        data={ transfersQuery.data?.items }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        showSocketInfo={ isSocketEnabled && transfersQuery.pagination.page === 1 }
        showSocketErrorAlert={ showSocketErrorAlert }
        socketInfoNum={ newItemsCount }
        tokenId={ tokenId }
        token={ token }
        instance={ tokenInstance }
        isLoading={ isLoading }
        resetKey={ transfersQuery.queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = token ? (
    <ActionBar mt={ -6 }>
      <TokenAdvancedFilterLink token={ token } isLoading={ isLoading } minH={ 8 }/>
      { transfersQuery.pagination.isVisible && <Pagination ml="auto" { ...transfersQuery.pagination }/> }
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ transfersQuery.isError }
      itemsNum={ transfersQuery.data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
      isTransitioning={ transfersQuery.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TokenTransfer);
