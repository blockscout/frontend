import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';

import TokensTable from './TokensTable';

type Props = {
  type: TokenType;
}

const TokensERC20 = ({ type }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { isError, isLoading, data, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { id: router.query.id?.toString() },
    filters: { type },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return <Skeleton w="500px" h="50px"/>;
  }

  return (
    <>
      { isMobile && isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      <TokensTable data={ data.items } top={ isPaginationVisible ? 72 : 0 }/>
    </>
  );

};

export default TokensERC20;
