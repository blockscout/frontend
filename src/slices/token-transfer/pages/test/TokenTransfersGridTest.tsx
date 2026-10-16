// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import ColumnsButton from 'src/shared/lists/columns/ColumnsButton';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import TokenTransfersGrid from '../../components/table/TokenTransfersGrid';
import { useTokenTransferColumns } from '../../hooks/useTokenTransferColumns';
import useTokenTransfersQuery from '../../hooks/useTokenTransfersQuery';

// Throwaway page: /token-transfers data rendered through a CSS grid instead of <table>.

const TokenTransfersGridTest = () => {
  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });
  const {
    columns,
    selectableColumns,
    checkedColumns,
    isCustomized,
    onColumnsChange,
    onColumnsReorder,
    onColumnsReset,
  } = useTokenTransferColumns('index', { typeFilter });

  const actionBar = (
    <ActionBar mt={ -6 }>
      <HStack gap={ 3 }>
        <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
          <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } category="all"/>
        </PopoverFilter>
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
    <>
      <PageTitle title="Token transfers (grid test)"/>
      <DataList
        isError={ query.isError }
        itemsNum={ query.data?.items.length }
        emptyText="There are no token transfers."
        actionBar={ actionBar }
        hasActiveFilters={ Boolean(typeFilter.length) }
        isTransitioning={ query.isTransitioning }
        emptyStateProps={{ term: 'token transfer' }}
      >
        <TokenTransfersGrid
          columns={ columns }
          items={ query.data?.items }
          isLoading={ query.isInitialLoading }
          resetKey={ query.queryHash }
          enableTimeIncrement
        />
      </DataList>
    </>
  );
};

export default TokenTransfersGridTest;
