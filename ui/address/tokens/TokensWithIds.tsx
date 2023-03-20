import { Grid, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressTokensResponse } from 'types/api/address';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

import NFTItem from './NFTItem';

type Props = {
  tokensQuery: UseQueryResult<AddressTokensResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokensWithIds = ({ tokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isLoading, data, pagination, isPaginationVisible } = tokensQuery;

  const actionBar = isMobile && isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const skeleton = (
    <Grid
      w="100%"
      columnGap={{ base: 3, lg: 6 }}
      rowGap={{ base: 3, lg: 6 }}
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
    >
      <Skeleton w={{ base: '100%', lg: '210px' }} h="272px"/>
      <Skeleton w={{ base: '100%', lg: '210px' }} h="272px"/>
      <Skeleton w={{ base: '100%', lg: '210px' }} h="272px"/>
      <Skeleton w={{ base: '100%', lg: '210px' }} h="272px"/>
      <Skeleton w={{ base: '100%', lg: '210px' }} h="272px"/>
    </Grid>
  );

  const content = data?.items ? (
    <Grid
      w="100%"
      columnGap={{ base: 3, lg: 6 }}
      rowGap={{ base: 3, lg: 6 }}
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
    >
      { data.items.map(item => <NFTItem key={ item.token.address } { ...item }/>) }
    </Grid>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data?.items }
      emptyText="There are no tokens of selected type."
      content={ content }
      actionBar={ actionBar }
      skeletonProps={{ customSkeleton: skeleton }}
    />
  );
};

export default TokensWithIds;
