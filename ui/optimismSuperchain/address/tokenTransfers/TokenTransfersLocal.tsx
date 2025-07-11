import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'toolkit/utils/htmlEntities';
import AddressAdvancedFilterLink from 'ui/address/AddressAdvancedFilterLink';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import type { Filters } from 'ui/address/useAddressTokenTransfersQuery';
import useAddressTokenTransfersSocket from 'ui/address/useAddressTokenTransfersSocket';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
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

  const { showSocketAlert, newItemsCount } = useAddressTokenTransfersSocket({
    filters,
    addressHash,
    data,
    enabled: pagination.page === 1,
  });

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <TokenTransferTable
          data={ data?.items }
          baseAddress={ addressHash }
          showTxInfo
          top={ ACTION_BAR_HEIGHT_DESKTOP }
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

  const actionBar = isMobile ? (
    <ActionBar>
      <HStack gap={ 2 }>
        <TokenTransferFilter
          defaultTypeFilters={ filters.type }
          onTypeFilterChange={ onTypeFilterChange }
          appliedFiltersNum={ filters.type.length }
          withAddressFilter
          onAddressFilterChange={ onAddressFilterChange }
          defaultAddressFilter={ filters.filter }
          isLoading={ query.isPlaceholderData }
        />
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
      <Pagination ml="auto" { ...pagination }/>
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

export default React.memo(TokenTransfersLocal);
