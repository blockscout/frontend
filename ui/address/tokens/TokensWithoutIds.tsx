import { Text, Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressTokensResponse } from 'types/api/address';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

type Props = {
  tokensQuery: UseQueryResult<AddressTokensResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokensWithoutIds = ({ tokensQuery }: Props) => {
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
        <Hide below="lg" ssr={ false }><SkeletonTable columns={ [ '30%', '30%', '10%', '20%', '10%' ] }/></Hide>
        <Show below="lg" ssr={ false }><SkeletonList/></Show>
      </>
    );
  }

  if (data.items.length === 0) {
    return <Text as="span">There are no tokens of selected type.</Text>;
  }

  return (
    <>
      { bar }
      <Hide below="lg" ssr={ false }><TokensTable data={ data.items } top={ isPaginationVisible ? 72 : 0 }/></Hide>
      <Show below="lg" ssr={ false }>{ data.items.map(item => <TokensListItem key={ item.token.address } { ...item }/>) }</Show>
    </>
  );

};

export default TokensWithoutIds;
