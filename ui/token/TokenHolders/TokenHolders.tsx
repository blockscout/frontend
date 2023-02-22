import { Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenHolders, TokenInfo } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

import TokenHoldersList from './TokenHoldersList';
import TokenHoldersTable from './TokenHoldersTable';

type Props = {
  tokenQuery: UseQueryResult<TokenInfo>;
  holdersQuery: UseQueryResult<TokenHolders> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenHoldersContent = ({ holdersQuery, tokenQuery }: Props) => {

  const isMobile = useIsMobile();
  if (holdersQuery.isError || tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  const bar = isMobile && holdersQuery.isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...holdersQuery.pagination }/>
    </ActionBar>
  );

  if (holdersQuery.isLoading || tokenQuery.isLoading) {
    return (
      <>
        { bar }
        { isMobile && <SkeletonList/> }
        { !isMobile && (
          <SkeletonTable columns={ [ '100%', '300px', '175px' ] } isLong/>
        ) }
      </>
    );
  }

  const items = holdersQuery.data.items;

  if (!items?.length) {
    return <Text as="span">There are no holders for this token.</Text>;
  }

  return (
    <>
      { bar }
      { !isMobile && <TokenHoldersTable data={ items } token={ tokenQuery.data } top={ holdersQuery.isPaginationVisible ? 80 : 0 }/> }
      { isMobile && <TokenHoldersList data={ items } token={ tokenQuery.data }/> }
    </>
  );
};

export default TokenHoldersContent;
