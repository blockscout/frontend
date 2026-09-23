// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokensSortingValue } from 'src/slices/token/types/api';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';
import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TokensTable from './TokensTable';

interface Props {
  query: ApiPaginatedQueryResult<'core:tokens'> | ApiPaginatedQueryResult<'core:tokens_bridged'> | ApiPaginatedQueryResult<'multichainAggregator:tokens'>;
  onSortChange?: OnValueChangeHandler;
  sort?: TokensSortingValue;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;
  tableTop?: number;
}

const Tokens = ({ query, onSortChange, sort, actionBar, description, hasActiveFilters, tableTop }: Props) => {

  const { isError, isInitialLoading, isTransitioning, data, pagination } = query;

  if (isError) {
    return <ApiFetchAlert/>;
  }

  const content = data?.items ? (
    <>
      { description }
      <TableContainerScrollable>
        <TokensTable
          items={ data.items }
          page={ pagination.page }
          isLoading={ isInitialLoading }
          setSorting={ onSortChange }
          sorting={ sort }
          top={ tableTop }
          resetKey={ query.queryHash }
        />
      </TableContainerScrollable>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no tokens."
      hasActiveFilters={ hasActiveFilters }
      emptyStateProps={{
        term: 'token',
      }}
      actionBar={ actionBar }
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default Tokens;
