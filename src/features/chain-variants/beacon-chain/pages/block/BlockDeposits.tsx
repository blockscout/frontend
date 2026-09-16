// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import BeaconChainDepositsList from '../deposits/BeaconChainDepositsList';
import BeaconChainDepositsTable from '../deposits/BeaconChainDepositsTable';

type Props = {
  blockDepositsQuery: ApiPaginatedQueryResult<'core:block_deposits'>;
};
const TABS_HEIGHT = 88;

const BlockDeposits = ({ blockDepositsQuery }: Props) => {
  const content = blockDepositsQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        <BeaconChainDepositsList
          items={ blockDepositsQuery.data.items }
          isLoading={ blockDepositsQuery.isInitialLoading }
          view="block"
          resetKey={ blockDepositsQuery.queryHash }
        />
      </Box>
      <Box hideBelow="lg">
        <BeaconChainDepositsTable
          items={ blockDepositsQuery.data.items }
          isLoading={ blockDepositsQuery.isInitialLoading }
          top={ blockDepositsQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          view="block"
          resetKey={ blockDepositsQuery.queryHash }
        />
      </Box>
    </>
  ) : null ;

  return (
    <DataList
      isError={ blockDepositsQuery.isError }
      itemsNum={ blockDepositsQuery.data?.items?.length }
      emptyText="There are no deposits for this block."
      isTransitioning={ blockDepositsQuery.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default BlockDeposits;
