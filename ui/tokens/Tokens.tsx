import React from 'react';

import type { TokensSortingValue } from 'types/api/tokens';

import { apos } from 'lib/html-entities';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import TokensTable from './TokensTable';

interface Props {
  query: QueryWithPagesResult<'tokens'> | QueryWithPagesResult<'tokens_bridged'>;
  onSortChange: () => void;
  sort: TokensSortingValue | undefined;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;
}

const Tokens = ({ query, onSortChange, sort, actionBar, hasActiveFilters }: Props) => {

  const { isError, isPlaceholderData, data, pagination } = query;

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = data?.items ? (
    <TokensTable
      items={ data.items }
      page={ pagination.page }
      isLoading={ isPlaceholderData }
      setSorting={ onSortChange }
      sorting={ sort }
    />
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find token that matches your filter query.`,
        hasActiveFilters,
      }}
      content={ content }
      actionBar={ query.pagination.isVisible || hasActiveFilters ? actionBar : null }
    />
  );
};

export default Tokens;
