import { Flex, Hide, Icon, Show, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import { AddressFromToFilterValues } from 'types/api/address';
import type { AddressFromToFilter, AddressTokenTransferResponse } from 'types/api/address';
import type { TokenType } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import crossIcon from 'icons/cross.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenLogo from 'ui/shared/TokenLogo';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

import AddressCsvExportLink from './AddressCsvExportLink';

type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
}

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);
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
    if (!filters.type.includes(tokenTransfer.token.type)) {
      return false;
    }
  }

  return true;
};

const AddressTokenTransfers = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const currentAddress = getQueryParamString(router.query.hash);

  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const tokenFilter = getQueryParamString(router.query.token_hash) || undefined;

  const [ filters, setFilters ] = React.useState<Filters>(
    {
      type: getTokenFilterValue(router.query.type) || [],
      filter: getAddressFilterValue(router.query.filter),
    },
  );

  const { isError, isLoading, data, pagination, onFilterChange, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_token_transfers',
    pathParams: { hash: currentAddress },
    filters: tokenFilter ? { token_hash: tokenFilter } : filters,
    scrollRef,
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

  const resetTokenFilter = React.useCallback(() => {
    onFilterChange({});
  }, [ onFilterChange ]);

  const resetTokenIconColor = useColorModeValue('blue.600', 'blue.300');
  const resetTokenIconHoverColor = useColorModeValue('blue.400', 'blue.200');

  const handleNewSocketMessage: SocketMessage.AddressTokenTransfer['handler'] = (payload) => {
    setSocketAlert('');

    if (data?.items && data.items.length >= OVERLOAD_COUNT) {
      if (matchFilters(filters, payload.token_transfer, currentAddress)) {
        setNewItemsCount(prev => prev + 1);
      }
    } else {
      queryClient.setQueryData(
        getResourceKey('address_token_transfers', { pathParams: { hash: currentAddress }, queryParams: { ...filters } }),
        (prevData: AddressTokenTransferResponse | undefined) => {
          if (!prevData) {
            return;
          }

          if (!matchFilters(filters, payload.token_transfer, currentAddress)) {
            return prevData;
          }

          return {
            ...prevData,
            items: [
              payload.token_transfer,
              ...prevData.items,
            ],
          };
        });
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
    isDisabled: pagination.page !== 1 || Boolean(tokenFilter),
  });

  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewSocketMessage,
  });

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !tokenFilter && !numActiveFilters && !data?.items.length;

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] }/>
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

    if (!data.items?.length && !numActiveFilters) {
      return <Text as="span">There are no token transfers</Text>;
    }

    if (!data.items?.length) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any token transfer that matches your query.` }/>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg" ssr={ false }>
          <TokenTransferTable
            data={ items }
            baseAddress={ currentAddress }
            showTxInfo
            top={ isActionBarHidden ? 0 : 80 }
            enableTimeIncrement
            showSocketInfo={ pagination.page === 1 && !tokenFilter }
            socketInfoAlert={ socketAlert }
            socketInfoNum={ newItemsCount }
          />
        </Hide>
        <Show below="lg" ssr={ false }>
          { pagination.page === 1 && !tokenFilter && (
            <SocketNewItemsNotice
              url={ window.location.href }
              num={ newItemsCount }
              alert={ socketAlert }
              type="token_transfer"
              borderBottomRadius={ 0 }
            />
          ) }
          <TokenTransferList
            data={ items }
            baseAddress={ currentAddress }
            showTxInfo
            enableTimeIncrement
          />
        </Show>
      </>
    );
  })();

  const tokenFilterComponent = tokenFilter && (
    <Flex alignItems="center" py={ 1 } flexWrap="wrap" mb={{ base: isPaginationVisible ? 6 : 3, lg: 0 }}>
      Filtered by token
      <TokenLogo hash={ tokenFilter } boxSize={ 6 } mx={ 2 }/>
      { isMobile ? tokenFilter.slice(0, 4) + '...' + tokenFilter.slice(-4) : tokenFilter }
      <Tooltip label="Reset filter">
        <Flex>
          <Icon
            as={ crossIcon }
            boxSize={ 6 }
            ml={ 1 }
            color={ resetTokenIconColor }
            cursor="pointer"
            _hover={{ color: resetTokenIconHoverColor }}
            onClick={ resetTokenFilter }
          />
        </Flex>
      </Tooltip>
    </Flex>
  );

  return (
    <>
      { isMobile && tokenFilterComponent }
      { !isActionBarHidden && (
        <ActionBar mt={ -6 }>
          { !isMobile && tokenFilterComponent }
          { !tokenFilter && (
            <TokenTransferFilter
              defaultTypeFilters={ filters.type }
              onTypeFilterChange={ handleTypeFilterChange }
              appliedFiltersNum={ numActiveFilters }
              withAddressFilter
              onAddressFilterChange={ handleAddressFilterChange }
              defaultAddressFilter={ filters.filter }
            />
          ) }
          { currentAddress && <AddressCsvExportLink address={ currentAddress } type="token-transfers" ml={{ base: 2, lg: 'auto' }}/> }
          { isPaginationVisible && <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/> }
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default AddressTokenTransfers;
