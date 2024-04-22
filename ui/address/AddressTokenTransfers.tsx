import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { AddressFromToFilterValues } from 'types/api/address';
import type { AddressFromToFilter } from 'types/api/address';
import type { TokenType } from 'types/api/token';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import ResetIconButton from 'ui/shared/ResetIconButton';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

import AddressCsvExportLink from './AddressCsvExportLink';

type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
}

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);
const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  // for tests only
  overloadCount?: number;
}

const AddressTokenTransfers = ({ scrollRef }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const currentAddress = getQueryParamString(router.query.hash);
  const tokenFilter = getQueryParamString(router.query.token) || undefined;

  const [ filters, setFilters ] = React.useState<Filters>(
    {
      type: getTokenFilterValue(router.query.type) || [],
      filter: getAddressFilterValue(router.query.filter),
    },
  );

  const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'address_token_transfers',
    pathParams: { hash: currentAddress },
    filters: tokenFilter ? { token: tokenFilter } : filters,
    scrollRef,
    options: {
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

  const resetTokenFilter = React.useCallback(() => {
    onFilterChange({});
  }, [ onFilterChange ]);

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !tokenFilter && !numActiveFilters && !data?.items.length && !currentAddress;

  const content = data?.items ? (
    <TokenTransferTable
      data={ data?.items }
      baseAddress={ currentAddress }
      showTxInfo
      top={ isActionBarHidden ? 0 : 80 }
      enableTimeIncrement
      isLoading={ isPlaceholderData }
    />
  ) : null;

  const tokenData = React.useMemo(() => ({
    address: tokenFilter || '',
    name: '',
    icon_url: '',
    symbol: '',
    type: 'ERC-20' as const,
  }), [ tokenFilter ]);

  const tokenFilterComponent = tokenFilter && (
    <Flex alignItems="center" flexWrap="wrap" mb={{ base: isActionBarHidden ? 3 : 6, lg: 0 }} mr={ 4 }>
      <Text whiteSpace="nowrap" mr={ 2 } py={ 1 }>Filtered by token</Text>
      <Flex alignItems="center" py={ 1 }>
        <TokenEntity.Icon token={ tokenData } isLoading={ isPlaceholderData }/>
        { isMobile ? <HashStringShorten hash={ tokenFilter }/> : tokenFilter }
        <ResetIconButton onClick={ resetTokenFilter }/>
      </Flex>
    </Flex>
  );

  const actionBar = (
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
              isLoading={ isPlaceholderData }
            />
          ) }
          { currentAddress && (
            <AddressCsvExportLink
              address={ currentAddress }
              params={{ type: 'token-transfers', filterType: 'address', filterValue: filters.filter }}
              ml={{ base: 2, lg: 'auto' }}
              isLoading={ isPlaceholderData }
            />
          ) }
          <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no token transfers."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        hasActiveFilters: Boolean(numActiveFilters),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressTokenTransfers;
