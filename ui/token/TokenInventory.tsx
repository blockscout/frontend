import { Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenInventoryResponse } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

import TokenInventoryItem from './TokenInventoryItem';

type Props = {
  inventoryQuery: UseQueryResult<TokenInventoryResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenInventory = ({ inventoryQuery }: Props) => {
  const isMobile = useIsMobile();

  const actionBar = isMobile && inventoryQuery.isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...inventoryQuery.pagination }/>
    </ActionBar>
  );

  const items = inventoryQuery.data?.items;

  const content = items ? (
    <Grid
      w="100%"
      columnGap={{ base: 3, lg: 6 }}
      rowGap={{ base: 3, lg: 6 }}
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
    >
      { items.map((item, index) => (
        <TokenInventoryItem
          key={ item.token.address + '_' + item.id + (inventoryQuery.isPlaceholderData ? '_' + index : '') }
          item={ item }
          isLoading={ inventoryQuery.isPlaceholderData }
        />
      )) }
    </Grid>
  ) : null;

  return (
    <DataListDisplay
      isError={ inventoryQuery.isError }
      items={ items }
      emptyText="There are no tokens."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TokenInventory;
