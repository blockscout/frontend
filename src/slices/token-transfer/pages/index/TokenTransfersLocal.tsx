// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import ColumnsButton from 'src/shared/filters/ColumnsButton';
import PopoverFilter from 'src/shared/filters/PopoverFilter';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import TokenTransfersTable from '../../components/table/TokenTransfersTable';
import { useTokenTransferColumns } from '../../hooks/useTokenTransferColumns';
import useTokenTransfersQuery from '../../hooks/useTokenTransfersQuery';

const TokenTransfersLocal = () => {
  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });
  const { columns, selectableColumns, checkedColumns, isCustomized, onColumnsChange, onColumnsReorder, onColumnsReset } = useTokenTransferColumns('index');

  const content = (
    <TokenTransfersTable
      surface="index"
      columns={ columns }
      items={ query.data?.items }
      isLoading={ query.isInitialLoading }
      resetKey={ query.queryHash }
      enableTimeIncrement
    />
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } category="all"/>
    </PopoverFilter>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      <HStack gap={ 3 }>
        { filter }
        <ColumnsButton
          tableColumns={ selectableColumns }
          columns={ checkedColumns }
          onChange={ onColumnsChange }
          onOrderChange={ onColumnsReorder }
          selected={ isCustomized }
          onReset={ onColumnsReset }
        />
      </HStack>
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
      hasActiveFilters={ Boolean(typeFilter.length) }
      isTransitioning={ query.isTransitioning }
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default TokenTransfersLocal;
