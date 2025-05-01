import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressFromToFilter, AddressTransactionsResponse } from 'types/api/address';
import type { Transaction, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

import { sortTxsFromSocket } from '../sortTxs';
import { SORT_OPTIONS } from '../useTxsSort';

const matchFilter = (filterValue: AddressFromToFilter, transaction: Transaction, address?: string) => {
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
  const [ alertText, setAlertText ] = React.useState('');
  const [ num, setNum ] = React.useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();

  const currentAddress = getQueryParamString(router.query.hash);
  const filterValue = getQueryParamString(router.query.filter);
  const page = getQueryParamString(router.query.page);
  const sort = getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS) || 'default';

  const handleNewSocketMessage: SocketMessage.AddressTxs['handler'] = React.useCallback((payload) => {
    setAlertText('');

    queryClient.setQueryData(
      getResourceKey('general:address_txs', { pathParams: { hash: currentAddress }, queryParams: filterValue ? { filter: filterValue } : undefined }),
      (prevData: AddressTransactionsResponse | undefined) => {
        if (!prevData) {
          return;
        }

        const newItems: Array<Transaction> = [];
        let newCount = 0;

        payload.transactions.forEach(tx => {
          const currIndex = prevData.items.findIndex((item) => item.hash === tx.hash);

          if (currIndex > -1) {
            prevData.items[currIndex] = tx;
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

        return {
          ...prevData,
          items: [
            ...newItems,
            ...prevData.items,
          ].sort(sortTxsFromSocket(sort)),
        };
      });
  }, [ currentAddress, filterValue, queryClient, sort ]);

  const handleSocketClose = React.useCallback(() => {
    setAlertText('Connection is lost. Please refresh the page to load new transactions.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setAlertText('An error has occurred while fetching new transactions. Please refresh the page.');
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

  return { num, alertText };
}
