import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { apos } from 'toolkit/utils/htmlEntities';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

import AddressAdvancedFilterLink from './AddressAdvancedFilterLink';
import AddressCsvExportLink from './AddressCsvExportLink';
import useAddressTokenTransfersQuery from './useAddressTokenTransfersQuery';
import useAddressTokenTransfersSocket from './useAddressTokenTransfersSocket';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  // for tests only
  overloadCount?: number;
};

const AddressTokenTransfers = ({ overloadCount, shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const currentAddress = getQueryParamString(router.query.hash);

  const { query, filters, onTypeFilterChange, onAddressFilterChange } = useAddressTokenTransfersQuery({ currentAddress, enabled: isQueryEnabled });
  const { data, isPlaceholderData, isError, pagination } = query;

  const { showSocketAlert, newItemsCount } = useAddressTokenTransfersSocket({
    filters,
    addressHash: currentAddress,
    data,
    overloadCount,
    enabled: isQueryEnabled && pagination.page === 1,
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
        onTypeFilterChange={ onTypeFilterChange }
        appliedFiltersNum={ numActiveFilters }
        withAddressFilter
        onAddressFilterChange={ onAddressFilterChange }
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
