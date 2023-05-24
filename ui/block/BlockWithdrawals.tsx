import { Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { BlockWithdrawalsResponse } from 'types/api/block';

import DataListDisplay from 'ui/shared/DataListDisplay';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

type QueryResult = UseQueryResult<BlockWithdrawalsResponse> & {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
};

type Props = {
  blockWithdrawalsQuery: QueryResult;
}

const BlockWithdrawals = ({ blockWithdrawalsQuery }: Props) => {
  const content = blockWithdrawalsQuery.data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { blockWithdrawalsQuery.data.items.map((item, index) => (
          <WithdrawalsListItem
            key={ item.index + (blockWithdrawalsQuery.isPlaceholderData ? String(index) : '') }
            item={ item }
            view="block"
            isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <WithdrawalsTable
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          top={ blockWithdrawalsQuery.isPaginationVisible ? 80 : 0 }
          view="block"
        />
      </Hide>
    </>
  ) : null ;

  return (
    <DataListDisplay
      isError={ blockWithdrawalsQuery.isError }
      isLoading={ false }
      items={ blockWithdrawalsQuery.data?.items }
      skeletonProps={{ isLongSkeleton: true, skeletonDesktopColumns: Array(4).fill(`${ 100 / 4 }%`), skeletonDesktopMinW: '950px' }}
      emptyText="There are no withdrawals for this block."
      content={ content }
    />
  );
};

export default BlockWithdrawals;
