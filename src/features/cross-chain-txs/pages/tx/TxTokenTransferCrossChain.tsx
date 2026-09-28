// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

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
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ txQuery.isError || crossChainQuery.isError }
      itemsNum={ crossChainQuery.data?.items.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
      isTransitioning={ crossChainQuery.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxTokenTransferCrossChain);
