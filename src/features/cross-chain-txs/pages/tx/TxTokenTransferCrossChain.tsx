// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import CrossChainFilterTags from '../../components/filters/CrossChainFilterTags';
import { hasActiveColumnFilters } from '../../components/filters/utils';
import TokenTransfersCrossChainTable from '../../components/token-transfers/TokenTransfersCrossChainTable';

interface Props {
  txQuery: TxQuery;
  crossChainQuery: ApiPaginatedQueryResult<'interchainIndexer:tx_transfers'>;
  isLoading?: boolean;
  tableTop?: number;
}

const TxTokenTransferCrossChain = ({ txQuery, crossChainQuery, isLoading, tableTop }: Props) => {
  const content = crossChainQuery.data?.items ? (
    <TableContainerScrollable>
      <TokenTransfersCrossChainTable
        data={ crossChainQuery.data.items }
        isLoading={ isLoading || crossChainQuery.isInitialLoading }
        top={ tableTop }
        resetKey={ crossChainQuery.queryHash }
        filters={ crossChainQuery.filters }
        onFilterChange={ crossChainQuery.onFilterChange }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <>
      <CrossChainFilterTags filters={ crossChainQuery.filters } onFilterChange={ crossChainQuery.onFilterChange } mb={ 3 }/>
      <DataList
        isError={ txQuery.isError || crossChainQuery.isError }
        itemsNum={ crossChainQuery.data?.items.length }
        emptyText="There are no cross-chain token transfers."
        emptyStateProps={{
          term: 'token transfer',
        }}
        hasActiveFilters={ hasActiveColumnFilters(crossChainQuery.filters) }
        isTransitioning={ crossChainQuery.isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(TxTokenTransferCrossChain);
