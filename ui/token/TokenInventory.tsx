import { Flex, Text, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import { TokenInventory } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

import TokenInventoryItem from './TokenInventoryItem';

type Props = {
  inventoryQuery: UseQueryResult<TokenInventory> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenInventory = ({ inventoryQuery }: Props) => {
  const isMobile = useIsMobile();
  if (inventoryQuery.isError) {
    return <DataFetchAlert/>;
  }

  const bar = isMobile && inventoryQuery.isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...inventoryQuery.pagination }/>
    </ActionBar>
  );

  if (inventoryQuery.isLoading) {
    return (
      <>
        { bar }
        <Flex columnGap={{ base: 3, lg: 6 }} rowGap={{ base: 3, lg: 6 }} flexWrap="wrap">
          <Skeleton w={{ base: 'calc((100% - 12px)/2)', lg: '210px' }} h="272px"/>
          <Skeleton w={{ base: 'calc((100% - 12px)/2)', lg: '210px' }} h="272px"/>
          <Skeleton w={{ base: 'calc((100% - 12px)/2)', lg: '210px' }} h="272px"/>
        </Flex>
      </>
    );
  }

  const items = inventoryQuery.data.items;

  if (!items?.length) {
    return <Text as="span">There are no tokens.</Text>;
  }

  return (
    <Flex columnGap={{ base: 3, lg: 6 }} rowGap={{ base: 3, lg: 6 }} flexWrap="wrap" justifyContent="space-between">
      { items.map((item) => <TokenInventoryItem key={ item.token.address } item={ item }/>) }
    </Flex>
  );
};

export default TokenInventory;
