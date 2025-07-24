import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressTokenTransferResponse } from 'types/api/address';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import { getResourceKey } from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import type { Filters } from './useAddressTokenTransfersQuery';

const matchFilters = (filters: Filters, tokenTransfer: TokenTransfer, address?: string) => {
  if (filters.filter) {
    if (filters.filter === 'from' && tokenTransfer.from.hash !== address) {
      return false;
    }
    if (filters.filter === 'to' && tokenTransfer.to.hash !== address) {
      return false;
    }
  }
  if (filters.type && filters.type.length) {
    if (!tokenTransfer.token || !filters.type.includes(tokenTransfer.token.type)) {
      return false;
    }
  }

  return true;
};

const OVERLOAD_COUNT = 75;

interface Props {
  filters: Filters;
  addressHash: string;
  data: AddressTokenTransferResponse | undefined;
  overloadCount?: number;
  enabled: boolean;
}

export default function useAddressTokenTransfersSocket({ filters, addressHash, data, overloadCount = OVERLOAD_COUNT, enabled }: Props) {
  const [ showSocketAlert, setShowSocketAlert ] = React.useState(false);
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const multichainContext = useMultichainContext();
  const queryClient = useQueryClient();

  const handleNewSocketMessage: SocketMessage.AddressTokenTransfer['handler'] = React.useCallback((payload) => {
    setShowSocketAlert(false);

    const newItems: Array<TokenTransfer> = [];
    let newCount = 0;

    payload.token_transfers.forEach(transfer => {
      if (data?.items && data.items.length + newItems.length >= overloadCount && enabled) {
        if (matchFilters(filters, transfer, addressHash)) {
          newCount++;
        }
      } else {
        if (matchFilters(filters, transfer, addressHash)) {
          newItems.push(transfer);
        }
      }
    });

    if (newCount > 0) {
      setNewItemsCount(prev => prev + newCount);
    }

    if (newItems.length > 0) {
      const queryKey = getResourceKey('general:address_token_transfers', {
        pathParams: { hash: addressHash },
        queryParams: { ...filters },
        chainSlug: multichainContext?.chain?.slug,
      });
      queryClient.setQueryData(
        queryKey,
        (prevData: AddressTokenTransferResponse | undefined) => {
          if (!prevData) {
            return;
          }

          return {
            ...prevData,
            items: [
              ...newItems,
              ...prevData.items,
            ],
          };
        },
      );
    }

  }, [ data?.items, overloadCount, enabled, filters, addressHash, multichainContext?.chain?.slug, queryClient ]);

  const handleSocketClose = React.useCallback(() => {
    setShowSocketAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowSocketAlert(true);
  }, []);

  const channel = useSocketChannel({
    topic: `addresses:${ addressHash.toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: !enabled,
  });

  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewSocketMessage,
  });

  return React.useMemo(() => ({
    showSocketAlert,
    newItemsCount,
  }), [ showSocketAlert, newItemsCount ]);
}
