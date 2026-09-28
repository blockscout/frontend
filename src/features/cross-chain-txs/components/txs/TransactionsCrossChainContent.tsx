// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'src/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList from 'src/shared/lists/DataList';
import type { Props as DataListProps } from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TransactionsCrossChainTable from './TransactionsCrossChainTable';

export interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainMessage>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  stickyHeader?: boolean;
  currentAddress?: string;
  resetKey?: string;
}

const TransactionsCrossChainContent = ({
  items,
  isLoading,
  pagination,
  stickyHeader = true,
  currentAddress,
  resetKey,
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
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      itemsNum={ items?.length }
      emptyText="There are no cross-chain transactions."
      emptyStateProps={{
        term: 'transaction',
      }}
      { ...rest }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TransactionsCrossChainContent);
