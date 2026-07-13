// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokensSortingValue } from 'src/slices/token/types/api';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

interface Props {
  query: QueryWithPagesResult<'core:tokens'> | QueryWithPagesResult<'core:tokens_bridged'> | QueryWithPagesResult<'multichainAggregator:tokens'>;
  onSortChange?: OnValueChangeHandler;
  sort?: TokensSortingValue;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;
  tableTop?: number;
}

const Tokens = ({ query, onSortChange, sort, actionBar, description, hasActiveFilters, tableTop }: Props) => {

  const { isError, isPlaceholderData, data, pagination } = query;

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: data?.items,
    isEnabled: !isPlaceholderData,
    resetKey: query.queryHash,
  });

  if (isError) {
    return <ApiFetchAlert/>;
  }

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { description }
        { data.items.slice(0, renderedItemsNum).map((item, index) => {
          const chainIds = 'chain_infos' in item ? Object.keys(item.chain_infos).join(',') : undefined;

          return (
            <TokensListItem
              key={ item.address_hash + (isPlaceholderData ? index : '') + (chainIds ? chainIds : '') }
              token={ item }
              index={ index }
              page={ pagination.page }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
        <Box ref={ cutRef } h={ 0 }/>
      </Box>
      <Box hideBelow="lg">
        { description }
        <TokensTable
          items={ data.items }
          page={ pagination.page }
          isLoading={ isPlaceholderData }
          setSorting={ onSortChange }
          sorting={ sort }
          top={ tableTop }
          resetKey={ query.queryHash }
        />
      </Box>
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
    >
      { content }
    </DataList>
  );
};

export default Tokens;
