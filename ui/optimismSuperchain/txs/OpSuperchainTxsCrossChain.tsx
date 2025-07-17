import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { SocketProvider } from 'lib/socket/context';
import { INTEROP_MESSAGE } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';

import CrossChainTxsTable from '../crossChainTxs/CrossChainTxsTable';

const socketUrl = config.apis.multichain?.socketEndpoint ? `${ config.apis.multichain.socketEndpoint }/socket` : undefined;

const OpSuperchainTxsCrossChain = () => {
  const { data, isError, isPlaceholderData } = useApiQuery('multichain:interop_messages', {
    queryOptions: {
      placeholderData: generateListStub<'multichain:interop_messages'>(INTEROP_MESSAGE, 5, { next_page_params: undefined }),
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        Coming soon 🔜
      </Box>
      <Box hideBelow="lg">
        <CrossChainTxsTable
          isLoading={ isPlaceholderData }
          items={ data.items }
          socketType="txs_home_cross_chain"
          top={ 0 }
        />
      </Box>
    </>
  ) : null;

  return (
    <SocketProvider url={ socketUrl }>
      <DataListDisplay
        itemsNum={ data?.items?.length }
        isError={ isError }
        emptyText="There are no cross-chain transactions."
      >
        { content }
      </DataListDisplay>
    </SocketProvider>
  );
};

export default React.memo(OpSuperchainTxsCrossChain);
