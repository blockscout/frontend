// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { operations, schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';
import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { TransactionsSortingValue } from 'src/slices/tx/types/api';

import { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import { sortTxsFromSocket } from '../utils/sort-txs';
import { SORT_OPTIONS } from './useTxsSort';

const matchFilter = (filterValue: AddressFromToFilter, transaction: schemas['Transaction'], address?: string) => {
  if (!filterValue) {
    return true;
  }

  if (filterValue === 'from') {
    return transaction.from.hash === address;
  }

  if (filterValue === 'to') {
    return transaction.to?.hash === address;
  }
};

const OVERLOAD_COUNT = config.app.isPw ? 2 : 75;

interface Params {
  isLoading?: boolean;
}

export default function useTxsSocketTypeAddress({ isLoading }: Params) {
  const [ showErrorAlert, setShowErrorAlert ] = React.useState(false);
  const [ num, setNum ] = React.useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();

  const currentAddress = getQueryParamString(router.query.hash);
  const filterValue = getQueryParamString(router.query.filter);
  const page = getQueryParamString(router.query.page);
  const sort = getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS) || 'default';
  const { chain } = useMultichainContext() || {};

  const handleNewSocketMessage: SocketMessage.AddressTxs['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('core:address_txs', {
      pathParams: { hash: currentAddress },
      queryParams: filterValue ? { filter: filterValue } : undefined,
      chainId: chain?.id,
    });
    setShowErrorAlert(false);

    queryClient.setQueryData(
      queryKey,
      (prevData: operations['AddressController.transactions']['json'] | undefined) => {
        if (!prevData) {
          return;
        }

        const newItems: Array<schemas['Transaction']> = [];
        let newCount = 0;
        let hasUpdatedItems = false;

        payload.transactions.forEach(tx => {
          const currIndex = prevData.items.findIndex((item) => item.hash === tx.hash);

          if (currIndex > -1) {
            prevData.items[currIndex] = tx;
            hasUpdatedItems = true;
          } else {
            const isMatch = matchFilter(filterValue as AddressFromToFilter, tx, currentAddress);
            if (isMatch) {
              if (newItems.length + prevData.items.length >= OVERLOAD_COUNT) {
                newCount++;
              } else {
                newItems.push(tx);
              }
            }
          }
        });

        if (newCount > 0) {
          setNum(prev => prev + newCount);
        }

        // Nothing changed in the visible list — the incoming items only bumped the "new items"
        // count above the header (list already past the overload threshold). Keep the previous
        // data reference so the memoized list doesn't re-render on every socket message.
        if (newItems.length === 0 && !hasUpdatedItems) {
          return prevData;
        }

        return {
          ...prevData,
          items: [
            ...newItems,
            ...prevData.items,
          ].sort(sortTxsFromSocket(sort)),
        };
      });
  }, [ currentAddress, filterValue, queryClient, sort, chain?.id ]);

  const handleSocketClose = React.useCallback(() => {
    setShowErrorAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowErrorAlert(true);
  }, []);

  const isDisabled = Boolean((page && page !== '1') || isLoading);

  const channel = useSocketChannel({
    topic: `addresses:${ currentAddress?.toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled,
  });

  useSocketMessage({
    channel,
    event: 'transaction',
    handler: handleNewSocketMessage,
  });

  useSocketMessage({
    channel,
    event: 'pending_transaction',
    handler: handleNewSocketMessage,
  });

  if (isDisabled) {
    return { };
  }

  return { num, showErrorAlert };
}
