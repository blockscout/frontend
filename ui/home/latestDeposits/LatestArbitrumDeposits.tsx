import { Text } from '@chakra-ui/react';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';

import useApiQuery from 'lib/api/useApiQuery';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { ARBITRUM_MESSAGES_ITEM } from 'stubs/arbitrumL2';

import LatestDeposits from './LatestDeposits';

const LatestArbitrumDeposits = () => {
  const isMobile = useIsMobile();
  const itemsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_arbitrum_deposits', {
    queryOptions: {
      placeholderData: { items: Array(itemsCount).fill(ARBITRUM_MESSAGES_ITEM) },
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

  const handleNewDepositMessage: SocketMessage.NewArbitrumDeposits['handler'] = React.useCallback((payload) => {
    setNum(payload.new_messages_to_rollup_amount);
  }, [ setNum ]);

  const channel = useSocketChannel({
    topic: 'arbitrum:new_messages_to_rollup_amount',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: false,
  });

  useSocketMessage({
    channel,
    event: 'new_messages_to_rollup_amount',
    handler: handleNewDepositMessage,
  });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    return (
      <LatestDeposits
        items={ data.items.slice(0, itemsCount).map((item) => (
          {
            l1BlockNumber: item.origination_transaction_block_number,
            l1TxHash: item.origination_transaction_hash,
            l2TxHash: item.completion_transaction_hash,
            timestamp: item.origination_timestamp,
          }
        )) }
        isLoading={ isPlaceholderData }
        socketItemsNum={ num }
        socketAlert={ socketAlert }
      />
    );
  }

  return null;
};

export default LatestArbitrumDeposits;
