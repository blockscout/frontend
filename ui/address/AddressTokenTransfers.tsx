import { Box, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import { AddressFromToFilterValues } from 'types/api/address';
import type { AddressFromToFilter, AddressTokenTransferResponse } from 'types/api/address';
import type { TokenType } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import { getResourceKey } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import { apos } from 'toolkit/utils/htmlEntities';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

import AddressAdvancedFilterLink from './AddressAdvancedFilterLink';
import AddressCsvExportLink from './AddressCsvExportLink';

type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
};

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);
const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const OVERLOAD_COUNT = 75;

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

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  // for tests only
  overloadCount?: number;
};

const AddressTokenTransfers = ({ overloadCount = OVERLOAD_COUNT, shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  const currentAddress = getQueryParamString(router.query.hash);

  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const [ filters, setFilters ] = React.useState<Filters>(
    {
      type: getTokenFilterValue(router.query.type) || [],
      filter: getAddressFilterValue(router.query.filter),
    },
  );

  const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'general:address_token_transfers',
    pathParams: { hash: currentAddress },
    filters,
    options: {
      enabled: isQueryEnabled,
      placeholderData: getTokenTransfersStub(undefined, {
        block_number: 7793535,
        index: 46,
        items_count: 50,
      }),
    },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    onFilterChange({ ...filters, type: nextValue });
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, onFilterChange ]);

  const handleAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    onFilterChange({ ...filters, filter: filterVal });
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, onFilterChange ]);

  const handleNewSocketMessage: SocketMessage.AddressTokenTransfer['handler'] = (payload) => {
    setSocketAlert('');

    const newItems: Array<TokenTransfer> = [];
    let newCount = 0;

    payload.token_transfers.forEach(transfer => {
      if (data?.items && data.items.length + newItems.length >= overloadCount) {
        if (matchFilters(filters, transfer, currentAddress)) {
          newCount++;
        }
      } else {
        if (matchFilters(filters, transfer, currentAddress)) {
          newItems.push(transfer);
        }
      }
    });

    if (newCount > 0) {
      setNewItemsCount(prev => prev + newCount);
    }

    if (newItems.length > 0) {
      queryClient.setQueryData(
        getResourceKey('general:address_token_transfers', { pathParams: { hash: currentAddress }, queryParams: { ...filters } }),
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

  };

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please refresh the page to load new token transfers.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new token transfers. Please refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic: `addresses:${ currentAddress.toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: pagination.page !== 1,
  });

  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewSocketMessage,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !numActiveFilters && !data?.items.length && !currentAddress;

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <TokenTransferTable
          data={ data?.items }
          baseAddress={ currentAddress }
          showTxInfo
          top={ isActionBarHidden ? 0 : ACTION_BAR_HEIGHT_DESKTOP }
          enableTimeIncrement
          showSocketInfo={ pagination.page === 1 }
          socketInfoAlert={ socketAlert }
          socketInfoNum={ newItemsCount }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            num={ newItemsCount }
            alert={ socketAlert }
            type="token_transfer"
            isLoading={ isPlaceholderData }
          />
        ) }
        <TokenTransferList
          data={ data?.items }
          baseAddress={ currentAddress }
          showTxInfo
          enableTimeIncrement
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const actionBar = !isActionBarHidden ? (
    <ActionBar mt={ -6 }>
      <TokenTransferFilter
        defaultTypeFilters={ filters.type }
        onTypeFilterChange={ handleTypeFilterChange }
        appliedFiltersNum={ numActiveFilters }
        withAddressFilter
        onAddressFilterChange={ handleAddressFilterChange }
        defaultAddressFilter={ filters.filter }
        isLoading={ isPlaceholderData }
      />
      <Flex columnGap={{ base: 2, lg: 6 }} ml={{ base: 2, lg: 'auto' }} _empty={{ display: 'none' }}>
        <AddressAdvancedFilterLink
          isLoading={ isPlaceholderData }
          address={ currentAddress }
          typeFilter={ filters.type }
          directionFilter={ filters.filter }
        />
        <AddressCsvExportLink
          address={ currentAddress }
          params={{ type: 'token-transfers', filterType: 'address', filterValue: filters.filter }}
          isLoading={ isPlaceholderData }
        />
      </Flex>
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no token transfers."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        hasActiveFilters: Boolean(numActiveFilters),
      }}
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressTokenTransfers;
