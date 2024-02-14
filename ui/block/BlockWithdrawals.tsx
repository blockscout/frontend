import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import BeaconChainWithdrawalsList from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsList';
import BeaconChainWithdrawalsTable from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable';

type Props = {
  blockWithdrawalsQuery: QueryWithPagesResult<'block_withdrawals'>;
}

const BlockWithdrawals = ({ blockWithdrawalsQuery }: Props) => {
  const content = blockWithdrawalsQuery.data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <BeaconChainWithdrawalsList
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          view="block"
        />
      </Show>
      <Hide below="lg" ssr={ false }>
        <BeaconChainWithdrawalsTable
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
