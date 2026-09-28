// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

interface Props {
  query: ApiPaginatedQueryResult<'core:block_internal_txs'>;
  top?: number;
}

const BlockInternalTxs = ({ query, top }: Props) => {
  const { data, isInitialLoading, isTransitioning, isError } = query;

  const content = data?.items ? (
    <TableContainerScrollable>
      <InternalTxsTable data={ data.items } isLoading={ isInitialLoading } top={ top } showBlockInfo={ false } resetKey={ query.queryHash }/>
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions."
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(BlockInternalTxs);
