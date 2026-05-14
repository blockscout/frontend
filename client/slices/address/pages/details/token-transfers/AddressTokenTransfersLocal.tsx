// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'client/slices/token/types/api';

import TokenTransferList from 'client/slices/token-transfer/components/list/TokenTransferList';
import TokenTransferTable from 'client/slices/token-transfer/components/list/TokenTransferTable';
import TokenTransferFilter from 'client/slices/token-transfer/components/TokenTransferFilter';

import AddressAdvancedFilterLink from 'client/features/advanced-filter/components/AddressAdvancedFilterLink';
import CsvExport from 'client/features/csv-export/components/CsvExport';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import { useMultichainContext } from 'lib/contexts/multichain';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import type { Filters } from './useAddressTokenTransfersQuery';
import useAddressTokenTransfersSocket from './useAddressTokenTransfersSocket';

interface Props {
  query: QueryWithPagesResult<'general:address_token_transfers'>;
  filters: Filters;
  addressHash: string;
  onTypeFilterChange: (type: Array<TokenType>) => void;
  onAddressFilterChange: (filter: string) => void;
  // for tests only
  overloadCount?: number;
}

const TokenTransfersLocal = ({ query, filters, addressHash, onTypeFilterChange, onAddressFilterChange, overloadCount }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = query;
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const { showSocketAlert, newItemsCount } = useAddressTokenTransfersSocket({
    filters,
    addressHash,
    data,
    overloadCount,
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
          appliedFiltersNum={ numActiveFilters }
          withAddressFilter
          onAddressFilterChange={ onAddressFilterChange }
          defaultAddressFilter={ filters.filter }
          isLoading={ query.isPlaceholderData }
          chainConfig={ multichainContext?.chain?.app_config }
        />
        <CsvExport
          type="address_token_transfers"
          resourceName="general:address_csv_export_token_transfers"
          pathParams={{ hash: addressHash }}
          queryParams={ filters.filter ? {
            filter_type: 'address',
            filter_value: filters.filter,
          } : undefined }
          loadingInitial={ isPlaceholderData }
        />
        <AddressAdvancedFilterLink
          isLoading={ isPlaceholderData }
          address={ addressHash }
          typeFilter={ filters.type }
          directionFilter={ filters.filter }
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
      hasActiveFilters={ Boolean(numActiveFilters) }
      emptyStateProps={{
        term: 'token transfer',
      }}
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TokenTransfersLocal);
