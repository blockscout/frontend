// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';
import InternalTxsZeroValueSwitch from 'src/slices/internal-tx/components/InternalTxsZeroValueSwitch';
import type { InternalTxsPaginatedQueryResult } from 'src/slices/internal-tx/hooks/useInternalTxsPaginatedQuery';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

interface Props {
  query: InternalTxsPaginatedQueryResult<'core:block_internal_txs'>;
  top?: number;
}

const BlockInternalTxs = ({ query, top }: Props) => {
  const isMobile = useIsMobile();
  const { data, isInitialLoading, isTransitioning, isError, pagination, isZeroValueShown, onZeroValueToggle } = query;

  const content = data?.items ? (
    <TableContainerScrollable>
      <InternalTxsTable data={ data.items } isLoading={ isInitialLoading } top={ top } showBlockInfo={ false } resetKey={ query.queryHash }/>
    </TableContainerScrollable>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar mt={ -6 }>
      <InternalTxsZeroValueSwitch
        isChecked={ isZeroValueShown }
        onChange={ onZeroValueToggle }
        isLoading={ pagination.isLoading }
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions."
      isTransitioning={ isTransitioning }
      actionBar={ actionBar }
      showActionBarIfEmpty
      showActionBarIfError
    >
      { content }
    </DataList>
  );
};

export default React.memo(BlockInternalTxs);
