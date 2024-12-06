import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressFromToFilter, AddressTransactionsResponse } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { Transaction, TransactionsSortingField, TransactionsSortingValue, TransactionsSorting } from 'types/api/transaction';

import { getResourceKey } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import { sortTxsFromSocket } from 'ui/txs/sortTxs';
import TxsWithAPISorting from 'ui/txs/TxsWithAPISorting';
import { SORT_OPTIONS } from 'ui/txs/useTxsSort';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';

const OVERLOAD_COUNT = 75;

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

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

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  // for tests only
  overloadCount?: number;
};

const AddressTxs = ({ scrollRef, overloadCount = OVERLOAD_COUNT, shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);
  const [ sort, setSort ] = React.useState<TransactionsSortingValue | undefined>(getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS));

  const isMobile = useIsMobile();
  const currentAddress = getQueryParamString(router.query.hash);

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const addressTxsQuery = useQueryWithPages({
    resourceName: 'address_txs',
    pathParams: { hash: currentAddress },
    filters: { filter: filterValue },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    scrollRef,
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'address_txs'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    addressTxsQuery.onFilterChange({ filter: newVal });
  }, [ addressTxsQuery ]);

  const handleNewSocketMessage: SocketMessage.AddressTxs['handler'] = React.useCallback((payload) => {
    setSocketAlert('');

    queryClient.setQueryData(
      getResourceKey('address_txs', { pathParams: { hash: currentAddress }, queryParams: { filter: filterValue } }),
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
            if (matchFilter(filterValue, tx, currentAddress)) {
              if (newItems.length + prevData.items.length >= overloadCount) {
                newCount++;
              } else {
                newItems.push(tx);
              }
            }
          }
        });

        if (newCount > 0) {
          setNewItemsCount(prev => prev + newCount);
        }

        return {
          ...prevData,
          items: [
            ...newItems,
            ...prevData.items,
          ].sort(sortTxsFromSocket(sort)),
        };
      });
  }, [ currentAddress, filterValue, overloadCount, queryClient, sort ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please refresh the page to load new transactions.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new transactions. Please refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic: `addresses:${ currentAddress?.toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: addressTxsQuery.pagination.page !== 1 || addressTxsQuery.isPlaceholderData,
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

  if (!isMounted || !shouldRender) {
    return null;
  }

  const filter = (
    <AddressTxsFilter
      defaultFilter={ filterValue }
      onFilterChange={ handleFilterChange }
      hasActiveFilter={ Boolean(filterValue) }
      isLoading={ addressTxsQuery.pagination.isLoading }
    />
  );

  const csvExportLink = (
    <AddressCsvExportLink
      address={ currentAddress }
      params={{ type: 'transactions', filterType: 'address', filterValue }}
      ml="auto"
      isLoading={ addressTxsQuery.pagination.isLoading }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar mt={ -6 }>
          { filter }
          { currentAddress && csvExportLink }
          <Pagination { ...addressTxsQuery.pagination } ml={ 8 }/>
        </ActionBar>
      ) }
      <TxsWithAPISorting
        filter={ filter }
        filterValue={ filterValue }
        query={ addressTxsQuery }
        currentAddress={ typeof currentAddress === 'string' ? currentAddress : undefined }
        enableTimeIncrement
        showSocketInfo={ addressTxsQuery.pagination.page === 1 }
        socketInfoAlert={ socketAlert }
        socketInfoNum={ newItemsCount }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        sorting={ sort }
        setSort={ setSort }
      />
    </>
  );
};

export default AddressTxs;
