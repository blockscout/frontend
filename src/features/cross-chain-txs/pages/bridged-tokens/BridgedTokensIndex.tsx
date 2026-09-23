// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CrossChainBridgedTokensSortingValue } from '../../types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';
import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import BridgedTokensTable from './BridgedTokensTable';

interface Props {
  query: ApiPaginatedQueryResult<'interchainIndexer:bridged_tokens'>;
  onSortChange: OnValueChangeHandler;
  sort: CrossChainBridgedTokensSortingValue;
  actionBar?: React.ReactNode;
  hasActiveFilters?: boolean;
  tableTop?: number;
}

const BridgedTokensIndex = ({ query, onSortChange, sort, actionBar, hasActiveFilters, tableTop }: Props) => {
  const chainsQuery = useApiQuery('interchainIndexer:chains');

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no bridged tokens."
      emptyStateProps={{
        term: 'bridged token',
      }}
      actionBar={ actionBar }
      hasActiveFilters={ hasActiveFilters }
      isTransitioning={ query.isTransitioning }
    >
      { query.data?.items ? (
        <TableContainerScrollable>
          <BridgedTokensTable
            data={ query.data.items }
            sort={ sort }
            setSorting={ onSortChange }
            chainsData={ chainsQuery.data?.items }
            isLoading={ query.isInitialLoading || chainsQuery.isPlaceholderData }
            resetKey={ query.queryHash }
            page={ query.pagination.page }
            top={ tableTop }
          />
        </TableContainerScrollable>
      ) : null }
    </DataList>
  );
};

export default React.memo(BridgedTokensIndex);
