// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import DataList from 'src/shared/lists/DataList';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import BeaconChainWithdrawalsList from '../withdrawals/BeaconChainWithdrawalsList';
import BeaconChainWithdrawalsTable from '../withdrawals/BeaconChainWithdrawalsTable';

type Props = {
  blockWithdrawalsQuery: QueryWithPagesResult<'general:block_withdrawals'>;
};
const TABS_HEIGHT = 88;

const BlockWithdrawals = ({ blockWithdrawalsQuery }: Props) => {
  const content = blockWithdrawalsQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        <BeaconChainWithdrawalsList
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          view="block"
        />
      </Box>
      <Box hideBelow="lg">
        <BeaconChainWithdrawalsTable
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          top={ blockWithdrawalsQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          view="block"
        />
      </Box>
    </>
  ) : null ;

  return (
    <DataList
      isError={ blockWithdrawalsQuery.isError }
      itemsNum={ blockWithdrawalsQuery.data?.items?.length }
      emptyText="There are no withdrawals for this block."
    >
      { content }
    </DataList>
  );
};

export default BlockWithdrawals;
