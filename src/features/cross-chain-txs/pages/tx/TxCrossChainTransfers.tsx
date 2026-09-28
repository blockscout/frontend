// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import DataList from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TokenTransfersCrossChainTable from '../../components/token-transfers/TokenTransfersCrossChainTable';

interface Props {
  data: Array<InterchainTransfer> | undefined;
  isLoading?: boolean;
  isError: boolean;
}

const TxCrossChainTransfers = ({ data, isLoading, isError }: Props) => {
  const content = data ? (
    <TableContainerScrollable>
      <TokenTransfersCrossChainTable data={ data } isLoading={ isLoading }/>
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxCrossChainTransfers);
