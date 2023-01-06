import { Flex, Skeleton, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressTokensResponse } from 'types/api/address';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
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

  if (isError) {
    return <DataFetchAlert/>;
  }

  const bar = isMobile && isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  if (isLoading) {
    return (
      <>
        { bar }
        <Flex columnGap={ 6 } rowGap={ 6 } flexWrap="wrap">
          <Skeleton w="210px" h="272px"/>
          <Skeleton w="210px" h="272px"/>
          <Skeleton w="210px" h="272px"/>
        </Flex>
      </>
    );
  }

  if (!data.items.length) {
    return <Text as="span">There are no tokens of selected type.</Text>;
  }
  return (
    <>
      { bar }
      <Flex columnGap={ 6 } rowGap={ 6 } flexWrap="wrap">
        { data.items.map(item => <NFTItem key={ item.token.address } { ...item }/>) }
      </Flex>
    </>
  );
};

export default TokensWithIds;
