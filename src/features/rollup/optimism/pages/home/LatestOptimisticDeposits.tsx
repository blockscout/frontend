// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import LatestTxsFallback from 'src/slices/home/pages/index/txs/LatestTxsFallback';

import LatestDeposits from 'src/features/rollup/common/pages/home/LatestDeposits';
import { L2_DEPOSIT_ITEM } from 'src/features/rollup/optimism/stubs';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import useGradualIncrement from 'src/shared/numbers/useGradualIncrement';

const LatestOptimisticDeposits = () => {
  const isMobile = useIsMobile();
  const itemsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('core:homepage_optimistic_deposits', {
    queryOptions: {
      placeholderData: Array(itemsCount).fill(L2_DEPOSIT_ITEM),
    },
  });

  const [ num, setNum ] = useGradualIncrement(0);
  const [ showSocketErrorAlert, setShowSocketErrorAlert ] = React.useState(false);

  const handleSocketClose = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const handleNewDepositMessage: SocketMessage.NewOptimisticDeposits['handler'] = React.useCallback((payload) => {
    setNum(payload.deposits);
  }, [ setNum ]);

  const channel = useSocketChannel({
    topic: 'optimism:new_deposits',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: false,
  });

  useSocketMessage({
    channel,
    event: 'new_optimism_deposits',
    handler: handleNewDepositMessage,
  });

  if (isError) {
    return <LatestTxsFallback/>;
  }

  if (data) {
    return (
      <LatestDeposits
        items={ data.slice(0, itemsCount).map((item) => (
          { l1BlockNumber: item.l1_block_number, l1TxHash: item.l1_transaction_hash, l2TxHash: item.l2_transaction_hash, timestamp: item.l1_block_timestamp }
        )) }
        isLoading={ isPlaceholderData }
        socketItemsNum={ num }
        showSocketErrorAlert={ showSocketErrorAlert }
      />
    );
  }

  return <Text>No latest deposits found.</Text>;
};

export default LatestOptimisticDeposits;
