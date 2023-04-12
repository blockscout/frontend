import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenHolders, TokenInfo } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';

import TokenHoldersList from './TokenHoldersList';
import TokenHoldersTable from './TokenHoldersTable';

type Props = {
  token?: TokenInfo;
  holdersQuery: UseQueryResult<TokenHolders> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenHoldersContent = ({ holdersQuery, token }: Props) => {

  const isMobile = useIsMobile();
  if (holdersQuery.isError) {
    return <DataFetchAlert/>;
  }

  const actionBar = isMobile && holdersQuery.isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...holdersQuery.pagination }/>
    </ActionBar>
  );

  const items = holdersQuery.data?.items;

  const content = items && token ? (
    <>
      { !isMobile && <TokenHoldersTable data={ items } token={ token } top={ holdersQuery.isPaginationVisible ? 80 : 0 }/> }
      { isMobile && <TokenHoldersList data={ items } token={ token }/> }
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ holdersQuery.isError }
      isLoading={ holdersQuery.isLoading }
      items={ holdersQuery.data?.items }
      skeletonProps={{ skeletonDesktopColumns: [ '100%', '300px', '175px' ] }}
      emptyText="There are no holders for this token."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TokenHoldersContent;
