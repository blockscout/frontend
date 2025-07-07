import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { ADDRESS_COUNTERS } from 'stubs/address';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { apos } from 'toolkit/utils/htmlEntities';
import AddressAdvancedFilterLink from 'ui/address/AddressAdvancedFilterLink';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import type { Filters } from 'ui/address/useAddressTokenTransfersQuery';
import useAddressTokenTransfersSocket from 'ui/address/useAddressTokenTransfersSocket';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

interface Props {
  query: QueryWithPagesResult<'general:address_token_transfers'>;
  filters: Filters;
  addressHash: string;
  onTypeFilterChange: (type: Array<TokenType>) => void;
  onAddressFilterChange: (filter: string) => void;
}

const TokenTransfersLocal = ({ query, filters, addressHash, onTypeFilterChange, onAddressFilterChange }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = query;
  const isMobile = useIsMobile();

  const countersQuery = useApiQuery('general:address_counters', {
    pathParams: {
      hash: addressHash,
    },
    queryOptions: {
      enabled: !isPlaceholderData,
      placeholderData: ADDRESS_COUNTERS,
    },
  });

  const { showSocketAlert, newItemsCount } = useAddressTokenTransfersSocket({
    filters,
    addressHash,
    data,
    enabled: pagination.page === 1,
  });

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !numActiveFilters && !data?.items.length && !addressHash;

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <TokenTransferTable
          data={ data?.items }
          baseAddress={ addressHash }
          showTxInfo
          top={ isActionBarHidden ? 0 : 56 }
          enableTimeIncrement
          showSocketInfo={ pagination.page === 1 }
          showSocketErrorAlert={ showSocketAlert }
          socketInfoNum={ newItemsCount }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            num={ newItemsCount }
            showErrorAlert={ showSocketAlert }
            type="token_transfer"
            isLoading={ isPlaceholderData }
          />
        ) }
        <TokenTransferList
          data={ data?.items }
          baseAddress={ addressHash }
          showTxInfo
          enableTimeIncrement
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const totalText = (
    <Skeleton loading={ countersQuery.isPlaceholderData }>
      A total of { Number(countersQuery.data?.token_transfers_count ?? 0).toLocaleString() } transfers found
    </Skeleton>
  );

  const filter = isMobile ? (
    <TokenTransferFilter
      defaultTypeFilters={ filters.type }
      onTypeFilterChange={ onTypeFilterChange }
      appliedFiltersNum={ filters.type.length }
      withAddressFilter
      onAddressFilterChange={ onAddressFilterChange }
      defaultAddressFilter={ filters.filter }
      isLoading={ query.isPlaceholderData }
    />
  ) : null;

  const actionBar = (
    <>
      { isMobile ? totalText : null }
      <ActionBar mt={{ base: 0, lg: -3 }} pt={{ base: 6, lg: 3 }} alignItems="center">
        { !isMobile ? totalText : null }
        <HStack gap={{ base: 2, lg: 6 }} ml={{ base: 0, lg: 'auto' }}>
          { filter }
          <AddressAdvancedFilterLink
            isLoading={ isPlaceholderData }
            address={ addressHash }
            typeFilter={ filters.type }
            directionFilter={ filters.filter }
          />
          <AddressCsvExportLink
            address={ addressHash }
            params={{ type: 'token-transfers', filterType: 'address', filterValue: filters.filter }}
            isLoading={ isPlaceholderData }
          />
        </HStack>
        <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
      </ActionBar>
    </>
  );

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

export default React.memo(TokenTransfersLocal);
