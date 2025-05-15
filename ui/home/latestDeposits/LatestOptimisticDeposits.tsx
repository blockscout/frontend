import { Text } from '@chakra-ui/react';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';

import useApiQuery from 'lib/api/useApiQuery';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { L2_DEPOSIT_ITEM } from 'stubs/L2';

import LatestDeposits from './LatestDeposits';

const LatestOptimisticDeposits = () => {
  const isMobile = useIsMobile();
  const itemsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_optimistic_deposits', {
    queryOptions: {
      placeholderData: Array(itemsCount).fill(L2_DEPOSIT_ITEM),
    },
  });

  const [ num, setNum ] = useGradualIncrement(0);
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please reload the page.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new transactions. Please reload the page.');
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
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    return (
      <LatestDeposits
        items={ data.slice(0, itemsCount).map((item) => (
          { l1BlockNumber: item.l1_block_number, l1TxHash: item.l1_transaction_hash, l2TxHash: item.l2_transaction_hash, timestamp: item.l1_block_timestamp }
        )) }
        isLoading={ isPlaceholderData }
        socketItemsNum={ num }
        socketAlert={ socketAlert }
      />
    );
  }

  return null;
};

export default LatestOptimisticDeposits;
