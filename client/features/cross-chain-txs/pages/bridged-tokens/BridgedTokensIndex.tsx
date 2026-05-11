import { Box } from '@chakra-ui/react';
import React from 'react';

import type { CrossChainBridgedTokensSortingValue } from '../../types/api';

import config from 'configs/app';
import type { OnValueChangeHandler } from 'toolkit/chakra/select';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import BridgedTokensListItem from './BridgedTokensListItem';
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
  return (
    <DataListDisplay
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
            { query.data.items.map((item, index) => {
              const tokenCurrentChain = item.tokens.find((token) => String(token.chain_id) === config.chain.id);

              return (
                <BridgedTokensListItem
                  key={ String(tokenCurrentChain?.token_address) + (query.isPlaceholderData ? index : '') }
                  data={ item }
                  token={ tokenCurrentChain }
                  index={ index }
                  page={ query.pagination.page }
                  isLoading={ query.isPlaceholderData }
                />
              );
            }) }
          </Box>
          <Box hideBelow="lg">
            <BridgedTokensTable
              data={ query.data.items }
              sort={ sort }
              setSorting={ onSortChange }
              isLoading={ query.isPlaceholderData }
              page={ query.pagination.page }
              top={ tableTop }
            />
          </Box>
        </>
      ) : null }
    </DataListDisplay>
  );
};

export default React.memo(BridgedTokensIndex);
