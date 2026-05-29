// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Grid, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenInfo } from 'src/slices/token/types/api';

import type { ResourceError } from 'src/api/resources';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import ResetFilterButton from 'src/shared/filters/ResetFilterButton';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import TokenInventoryItem from './TokenInventoryItem';

type Props = {
  inventoryQuery: QueryWithPagesResult<'general:token_inventory'>;
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  ownerFilter?: string;
  shouldRender?: boolean;
};

const TokenInventory = ({ inventoryQuery, tokenQuery, ownerFilter, shouldRender = true }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const resetOwnerFilter = React.useCallback(() => {
    inventoryQuery.onFilterChange({});
  }, [ inventoryQuery ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const isActionBarHidden = !ownerFilter && !inventoryQuery.data?.items.length;

  const ownerFilterComponent = ownerFilter && (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      mb={{ base: isActionBarHidden ? 3 : 6, lg: 3 }}
      mr={ 4 }
    >
      <Text whiteSpace="nowrap" mr={ 2 } py={ 1 }>Filtered by owner</Text>
      <Flex alignItems="center" py={ 1 }>
        <AddressEntity address={{ hash: ownerFilter }} truncation={ isMobile ? 'constant' : 'none' }/>
        <ResetFilterButton onClick={ resetOwnerFilter }/>
      </Flex>
    </Flex>
  );

  const actionBar = !isActionBarHidden && (
    <>
      { ownerFilterComponent }
      <ActionBar mt={ -6 }>
        { isMobile && <Pagination ml="auto" { ...inventoryQuery.pagination }/> }
      </ActionBar>
    </>
  );

  const items = inventoryQuery.data?.items;
  const token = tokenQuery.data;

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
            isLoading={ inventoryQuery.isPlaceholderData || tokenQuery.isPlaceholderData }
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
      { content }
    </DataList>
  );
};

export default TokenInventory;
