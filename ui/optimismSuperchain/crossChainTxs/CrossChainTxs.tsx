import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TxsSocketType } from 'ui/txs/socket/types';

import config from 'configs/app';
import { SocketProvider } from 'lib/socket/context';
import DataListDisplay from 'ui/shared/DataListDisplay';

import CrossChainTxsTable from '../crossChainTxs/CrossChainTxsTable';

const socketUrl = config.apis.multichain?.socketEndpoint ? `${ config.apis.multichain.socketEndpoint }/socket` : undefined;

interface Props {
  items?: Array<multichain.InteropMessage>;
  isLoading: boolean;
  isError: boolean;
  socketType?: TxsSocketType;
  tableHeaderTop?: number;
  currentAddress?: string;
}

const CrossChainTxs = ({ items, isLoading, isError, socketType, tableHeaderTop, currentAddress }: Props) => {
  const content = items ? (
    <DataListDisplay
      itemsNum={ items?.length }
      isError={ isError }
      emptyText="There are no cross-chain transactions."
    >
      <Box hideFrom="lg">
        Coming soon 🔜
      </Box>
      <Box hideBelow="lg">
        <CrossChainTxsTable
          isLoading={ isLoading }
          items={ items }
          socketType={ socketType }
          top={ tableHeaderTop }
          stickyHeader={ tableHeaderTop !== undefined }
          currentAddress={ currentAddress }
        />
      </Box>
    </DataListDisplay>
  ) : null;

  if (socketType) {
    return (
      <SocketProvider url={ socketUrl }>
        { content }
      </SocketProvider>
    );
  }

  return content;
};

export default React.memo(CrossChainTxs);
