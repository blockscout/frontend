// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'src/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList, { type Props as DataListProps } from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TokenTransfersCrossChainTable from './TokenTransfersCrossChainTable';

interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainTransfer>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  currentAddress?: string;
  tableTop?: number;
  resetKey?: string;
}

const TokenTransfersCrossChainContent = ({ items, isLoading, pagination, currentAddress, tableTop, resetKey, ...rest }: Props) => {

  const content = items ? (
    <TableContainerScrollable>
      <TokenTransfersCrossChainTable
        data={ items }
        isLoading={ isLoading }
        top={ tableTop ?? (pagination?.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
        currentAddress={ currentAddress }
        resetKey={ resetKey }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      itemsNum={ items?.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
      { ...rest }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TokenTransfersCrossChainContent);
