import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressFromToFilter, AddressTransactionsResponse } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import TxsContent from 'ui/txs/TxsContent';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';

const OVERLOAD_COUNT = 75;

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const AddressTxs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const isMobile = useIsMobile();
  const currentAddress = getQueryParamString(router.query.hash);

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const addressTxsQuery = useQueryWithPages({
    resourceName: 'address_txs',
    pathParams: { hash: currentAddress },
    filters: { filter: filterValue },
    scrollRef,
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    addressTxsQuery.onFilterChange({ filter: newVal });
  }, [ addressTxsQuery ]);

  const handleNewSocketMessage: SocketMessage.AddressTxs['handler'] = (payload) => {
    setSocketAlert('');

    if (addressTxsQuery.data?.items && addressTxsQuery.data.items.length >= OVERLOAD_COUNT) {
      if (
        !filterValue ||
        (filterValue === 'from' && payload.transaction.from.hash === currentAddress) ||
        (filterValue === 'to' && payload.transaction.to?.hash === currentAddress)
      ) {
        setNewItemsCount(prev => prev + 1);
      }
    }

    queryClient.setQueryData(
      getResourceKey('address_txs', { pathParams: { hash: currentAddress }, queryParams: { filter: filterValue } }),
      (prevData: AddressTransactionsResponse | undefined) => {
        if (!prevData) {
          return;
        }

        const currIndex = prevData.items.findIndex((tx) => tx.hash === payload.transaction.hash);

        if (currIndex > -1) {
          prevData.items[currIndex] = payload.transaction;
          return prevData;
        }

        if (prevData.items.length >= OVERLOAD_COUNT) {
          return prevData;
        }

        if (filterValue) {
          if (
            (filterValue === 'from' && payload.transaction.from.hash !== currentAddress) ||
              (filterValue === 'to' && payload.transaction.to?.hash !== currentAddress)
          ) {
            return prevData;
          }
        }

        return {
          ...prevData,
          items: [
            payload.transaction,
            ...prevData.items,
          ],
        };
      });
  };

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
    isDisabled: addressTxsQuery.pagination.page !== 1,
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

  const filter = (
    <AddressTxsFilter
      defaultFilter={ filterValue }
      onFilterChange={ handleFilterChange }
      isActive={ Boolean(filterValue) }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar mt={ -6 }>
          { filter }
          { currentAddress && <AddressCsvExportLink address={ currentAddress } type="transactions" ml="auto"/> }
          { addressTxsQuery.isPaginationVisible && <Pagination { ...addressTxsQuery.pagination } ml={ 8 }/> }
        </ActionBar>
      ) }
      <TxsContent
        filter={ filter }
        query={ addressTxsQuery }
        currentAddress={ typeof currentAddress === 'string' ? currentAddress : undefined }
        enableTimeIncrement
        showSocketInfo={ addressTxsQuery.pagination.page === 1 }
        socketInfoAlert={ socketAlert }
        socketInfoNum={ newItemsCount }
        top={ 80 }
      />
    </>
  );
};

export default AddressTxs;
