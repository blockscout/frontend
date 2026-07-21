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
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import TokenInventoryItem from './TokenInventoryItem';

interface Props {
  hash: string;
  token: schemas['Token'] | undefined;
  isLoading?: boolean;
  ownerFilter?: string;
};

const TokenInventory = ({ hash, token, isLoading: isLoadingProp, ownerFilter }: Props) => {
  const isMobile = useIsMobile();

  const inventoryQuery = useQueryWithPages({
    resourceName: 'core:token_inventory',
    pathParams: { hash },
    filters: ownerFilter ? { holder_address_hash: ownerFilter } : {},
    options: {
      placeholderData: generateListStub<'core:token_inventory'>(TOKEN_INSTANCE_ITEM, 50, { next_page_params: { unique_token: 1 } }),
    },
  });

  const isLoading = isLoadingProp || Boolean(inventoryQuery.isPlaceholderData);

  const resetOwnerFilter = React.useCallback(() => {
    inventoryQuery.onFilterChange({});
  }, [ inventoryQuery ]);

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
        { items.map((item, index) => (
          <TokenInventoryItem
            key={ item.id + '_' + index + (inventoryQuery.isPlaceholderData ? '_' + 'placeholder' : '') }
            item={ item }
            isLoading={ isLoading }
            token={ token }
          />
        )) }
      </Grid>
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
    >
      { isMobile && ownerFilterComponent }
      { content }
    </DataList>
  );
};

export default TokenInventory;
