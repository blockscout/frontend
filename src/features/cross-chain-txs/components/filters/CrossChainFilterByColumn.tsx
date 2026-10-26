// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';

import ColumnFilter from 'src/shared/filters/ColumnFilter';

import ChainFilter from './ChainFilter';
import ProtocolFilter from './ProtocolFilter';
import type { CrossChainColumnFilterField, CrossChainFilterChangeHandler } from './utils';

export type CrossChainFilterColumn = 'source' | 'destination' | 'protocol';

interface Props {
  column: CrossChainFilterColumn;
  filters: CrossChainFilters;
  onFilterChange: CrossChainFilterChangeHandler;
  isLoading?: boolean;
}

const CrossChainFilterByColumn = ({ column, filters, onFilterChange, isLoading }: Props) => {
  const handleFilterChange = React.useCallback((field: CrossChainColumnFilterField, value: string | undefined) => {
    onFilterChange({ ...filters, [field]: value });
  }, [ filters, onFilterChange ]);

  switch (column) {
    case 'source': {
      return (
        <ColumnFilter
          columnName="Source tx"
          isLoading={ isLoading }
          selected={ Boolean(filters.src_chain_ids) }
          contentProps={{ w: '382px' }}
        >
          <ChainFilter direction="source" value={ filters.src_chain_ids } handleFilterChange={ handleFilterChange }/>
        </ColumnFilter>
      );
    }
    case 'destination': {
      return (
        <ColumnFilter
          columnName="Destination tx"
          isLoading={ isLoading }
          selected={ Boolean(filters.dst_chain_ids) }
          contentProps={{ w: '382px' }}
        >
          <ChainFilter direction="destination" value={ filters.dst_chain_ids } handleFilterChange={ handleFilterChange }/>
        </ColumnFilter>
      );
    }
    case 'protocol': {
      return (
        <ColumnFilter
          columnName="Protocol"
          isLoading={ isLoading }
          selected={ Boolean(filters.bridge_ids) }
          contentProps={{ w: '382px' }}
        >
          <ProtocolFilter value={ filters.bridge_ids } handleFilterChange={ handleFilterChange }/>
        </ColumnFilter>
      );
    }
  }
};

export default React.memo(CrossChainFilterByColumn);
