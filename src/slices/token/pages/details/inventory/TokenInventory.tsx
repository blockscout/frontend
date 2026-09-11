// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { TOKEN_INSTANCE_ITEM } from 'src/slices/token/stubs';

import ResetFilterButton from 'src/shared/filters/ResetFilterButton';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import TokenInventoryItem from './TokenInventoryItem';

// grid layout (not a table), so the initial window is larger than the default
const INITIAL_RENDERED_ITEMS_NUM = 30;

interface Props {
  hash: string;
  token: schemas['Token'] | undefined;
  isLoading?: boolean;
};

const TokenInventory = ({ hash, token, isLoading: isLoadingProp }: Props) => {
  const isMobile = useIsMobile();

  const inventoryQuery = useApiPaginatedQuery({
    resourceName: 'core:token_inventory',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'core:token_inventory'>(TOKEN_INSTANCE_ITEM, 50, { next_page_params: { unique_token: 1 } }),
    },
  });

  const ownerFilter = getQueryParamString(inventoryQuery.filters.holder_address_hash) || undefined;
  const isLoading = isLoadingProp || inventoryQuery.isInitialLoading;

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: inventoryQuery.data?.items,
    isEnabled: !isLoading,
    minItemsNum: INITIAL_RENDERED_ITEMS_NUM,
    resetKey: inventoryQuery.queryHash,
  });

  const { onFilterChange } = inventoryQuery;
  const resetOwnerFilter = React.useCallback(() => {
    onFilterChange({});
  }, [ onFilterChange ]);

  const ownerFilterComponent = ownerFilter && (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      mr={{ base: 0, lg: 4 }}
      minH={{ lg: 8 }}
      mb={{ base: 3, lg: 0 }}
    >
      <Text whiteSpace="nowrap" mr={ 2 }>Filtered by owner</Text>
      <Flex alignItems="center">
        <AddressEntity address={{ hash: ownerFilter }} truncation={ isMobile ? 'constant' : 'none' }/>
        <ResetFilterButton onClick={ resetOwnerFilter }/>
      </Flex>
    </Flex>
  );

  const actionBar = (ownerFilter || inventoryQuery.pagination.isVisible) ? (
    <ActionBar mt={ -6 }>
      { !isMobile && ownerFilterComponent }
      { inventoryQuery.pagination.isVisible && <Pagination ml="auto" { ...inventoryQuery.pagination }/> }
    </ActionBar>
  ) : null;

  const items = inventoryQuery.data?.items;

  const content = items && token ? (
    <AddressHighlightProvider>
      <Grid
        w="100%"
        columnGap={{ base: 3, lg: 6 }}
        rowGap={{ base: 3, lg: 6 }}
        gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
      >
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <TokenInventoryItem
            key={ item.id + (isLoading ? '_' + index : '') }
            item={ item }
            isLoading={ isLoading }
            token={ token }
          />
        )) }
      </Grid>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  ) : null;

  return (
    <DataList
      isError={ inventoryQuery.isError }
      itemsNum={ items?.length }
      emptyText="There are no tokens."
      hasActiveFilters={ Boolean(ownerFilter) }
      emptyStateProps={{
        description: 'No tokens found for the selected owner.',
      }}
      actionBar={ actionBar }
      isTransitioning={ inventoryQuery.isTransitioning }
    >
      { isMobile && ownerFilterComponent }
      { content }
    </DataList>
  );
};

export default TokenInventory;
