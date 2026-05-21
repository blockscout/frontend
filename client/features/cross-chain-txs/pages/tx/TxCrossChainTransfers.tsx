// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import TokenTransfersCrossChainListItem from 'client/features/cross-chain-txs/components/token-transfers/TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from 'client/features/cross-chain-txs/components/token-transfers/TokenTransfersCrossChainTable';
import { getItemKey } from 'client/features/cross-chain-txs/components/token-transfers/utils';

import DataListDisplay from 'ui/shared/DataListDisplay';

interface Props {
  data: Array<InterchainTransfer> | undefined;
  isLoading?: boolean;
  isError: boolean;
}

const TxCrossChainTransfers = ({ data, isLoading, isError }: Props) => {
  const content = data ? (
    <>
      <Box hideFrom="lg">
        { data.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            py={ 4 }
            textStyle="sm"
            rowGap="14px"
            _first={{
              borderTopWidth: '0',
              paddingTop: '0',
            }}
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable data={ data } isLoading={ isLoading }/>
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TxCrossChainTransfers);
