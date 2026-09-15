// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';

import useTokenTransfersQuery from '../../hooks/useTokenTransfersQuery';
import { getTokenTransferKey } from '../../utils/get-token-transfer-key';
import TokenTransfersListItem from './TokenTransfersListItem';
import TokenTransfersTable from './TokenTransfersTable';

const TokenTransfersLocal = () => {
  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });
  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: query.data?.items,
    isEnabled: !query.isInitialLoading,
    resetKey: query.queryHash,
  });

  const content = (
    <>
      <Box hideFrom="lg">
        { query.data?.items.slice(0, renderedItemsNum).map((item, index) => (
          <TokenTransfersListItem
            key={ getTokenTransferKey(item) + (query.isInitialLoading ? index : '') }
            isLoading={ query.isInitialLoading }
            item={ item }
          />
        )) }
        <Box ref={ cutRef } h={ 0 }/>
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isInitialLoading }
          resetKey={ query.queryHash }
        />
      </Box>
    </>
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } category="all"/>
    </PopoverFilter>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      { filter }
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
