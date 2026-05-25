// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'client/slices/token/types/api';

import TokenTypeFilter from 'client/slices/token/components/TokenTypeFilter';

import PopoverFilter from 'client/shared/filters/PopoverFilter';
import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import useTokenTransfersQuery from '../../hooks/useTokenTransfersQuery';
import TokenTransfersListItem from './TokenTransfersListItem';
import TokenTransfersTable from './TokenTransfersTable';

const TokenTransfersLocal = () => {
  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });

  const content = (
    <>
      <Box hideFrom="lg">
        { query.data?.items.map((item, index) => (
          <TokenTransfersListItem
            key={ item.transaction_hash + item.log_index + (query.isPlaceholderData ? index : '') }
            isLoading={ query.isPlaceholderData }
            item={ item }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData }
        />
      </Box>
    </>
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } nftOnly={ false }/>
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
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default TokenTransfersLocal;
