// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { CrossChainBridgedTokensSortingValue } from '../../types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import DataList from 'src/shared/lists/DataList';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

import BridgedTokensList from './BridgedTokensList';
import BridgedTokensTable from './BridgedTokensTable';

interface Props {
  query: QueryWithPagesResult<'interchainIndexer:bridged_tokens'>;
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
    >
      { query.data?.items ? (
        <>
          <Box hideFrom="lg">
            <BridgedTokensList
              data={ query.data.items }
              page={ query.pagination.page }
              chainsData={ chainsQuery.data?.items }
              isLoading={ query.isPlaceholderData || chainsQuery.isPlaceholderData }
              resetKey={ query.queryHash }
            />
          </Box>
          <Box hideBelow="lg">
            <BridgedTokensTable
              data={ query.data.items }
              sort={ sort }
              setSorting={ onSortChange }
              chainsData={ chainsQuery.data?.items }
              isLoading={ query.isPlaceholderData || chainsQuery.isPlaceholderData }
              resetKey={ query.queryHash }
              page={ query.pagination.page }
              top={ tableTop }
            />
          </Box>
        </>
      ) : null }
    </DataList>
  );
};

export default React.memo(BridgedTokensIndex);
