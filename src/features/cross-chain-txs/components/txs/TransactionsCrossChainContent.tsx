// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';
import type { PaginationParams } from 'src/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList from 'src/shared/lists/DataList';
import type { Props as DataListProps } from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import CrossChainFilterTags from '../filters/CrossChainFilterTags';
import type { CrossChainFilterChangeHandler } from '../filters/utils';
import { hasActiveColumnFilters } from '../filters/utils';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

export interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainMessage>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  stickyHeader?: boolean;
  currentAddress?: string;
  resetKey?: string;
  filters?: CrossChainFilters;
  onFilterChange?: CrossChainFilterChangeHandler;
}

const TransactionsCrossChainContent = ({
  items,
  isLoading,
  pagination,
  stickyHeader = true,
  currentAddress,
  resetKey,
  filters,
  onFilterChange,
  ...rest
}: Props) => {
  const content = items ? (
    <TableContainerScrollable>
      <TransactionsCrossChainTable
        data={ items }
        isLoading={ isLoading }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        stickyHeader={ stickyHeader }
        currentAddress={ currentAddress }
        resetKey={ resetKey }
        filters={ filters }
        onFilterChange={ onFilterChange }
      />
    </TableContainerScrollable>
  ) : null;

  // The sticky action bar pulls itself up by 24px (its own negative top margin) over whatever precedes it.
  const tagsRowMarginBottom = rest.actionBar && pagination?.isVisible ? 6 : 3;

  return (
    <>
      { filters && onFilterChange && (
        <CrossChainFilterTags filters={ filters } onFilterChange={ onFilterChange } mb={ tagsRowMarginBottom }/>
      ) }
      <DataList
        itemsNum={ items?.length }
        emptyText="There are no cross-chain transactions."
        emptyStateProps={{
          term: 'transaction',
        }}
        hasActiveFilters={ hasActiveColumnFilters(filters) }
        { ...rest }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(TransactionsCrossChainContent);
