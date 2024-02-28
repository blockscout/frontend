import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import type { TokensSortingValue } from 'types/api/tokens';

import { apos } from 'lib/html-entities';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

interface Props {
  query: QueryWithPagesResult<'tokens'> | QueryWithPagesResult<'tokens_bridged'>;
  onSortChange: () => void;
  sort: TokensSortingValue | undefined;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;
}

const Tokens = ({ query, onSortChange, sort, actionBar, description, hasActiveFilters }: Props) => {

  const { isError, isPlaceholderData, data, pagination } = query;

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { description }
        { data.items.map((item, index) => (
          <TokensListItem
            key={ item.address + (isPlaceholderData ? index : '') }
            token={ item }
            index={ index }
            page={ pagination.page }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        { description }
        <TokensTable
          items={ data.items }
          page={ pagination.page }
          isLoading={ isPlaceholderData }
          setSorting={ onSortChange }
          sorting={ sort }
        />
      </Hide>
    </>
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
