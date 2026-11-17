// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import BeaconChainWithdrawalsTable from '../withdrawals/BeaconChainWithdrawalsTable';

type Props = {
  blockWithdrawalsQuery: ApiPaginatedQueryResult<'core:block_withdrawals'>;
};
const TABS_HEIGHT = 88;

const BlockWithdrawals = ({ blockWithdrawalsQuery }: Props) => {
  const content = blockWithdrawalsQuery.data?.items ? (
    <TableContainerScrollable>
      <BeaconChainWithdrawalsTable
        items={ blockWithdrawalsQuery.data.items }
        isLoading={ blockWithdrawalsQuery.isInitialLoading }
        top={ blockWithdrawalsQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
        view="block"
        resetKey={ blockWithdrawalsQuery.queryHash }
      />
    </TableContainerScrollable>
  ) : null ;

  return (
    <DataList
      isError={ blockWithdrawalsQuery.isError }
      itemsNum={ blockWithdrawalsQuery.data?.items?.length }
      emptyText="There are no withdrawals for this block."
      isTransitioning={ blockWithdrawalsQuery.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default BlockWithdrawals;
