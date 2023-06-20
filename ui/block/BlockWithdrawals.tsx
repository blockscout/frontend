import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

type Props = {
  blockWithdrawalsQuery: QueryWithPagesResult<'block_withdrawals'>;
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
          top={ blockWithdrawalsQuery.pagination.isVisible ? 80 : 0 }
          view="block"
        />
      </Hide>
    </>
  ) : null ;

  return (
    <DataListDisplay
      isError={ blockWithdrawalsQuery.isError }
      items={ blockWithdrawalsQuery.data?.items }
      emptyText="There are no withdrawals for this block."
      content={ content }
    />
  );
};

export default BlockWithdrawals;
