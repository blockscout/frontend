import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import txIcon from 'icons/transactions.svg';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import StatsItem from './StatsItem';

interface Props {
  value: string;
}

const StatsTotalTxs = ({ value }: Props) => {
  const queryClient = useQueryClient();
  const [ num, setNum ] = useGradualIncrement(Number(value));

  const handleNewMessage: SocketMessage.NewTx['handler'] = React.useCallback((payload) => {
    setNum(payload.transaction);
    queryClient.setQueryData([ QueryKeys.homeStats ], (prevData: HomeStats | undefined) => {
      if (!prevData) {
        return;
      }

      return {
        ...prevData,
        total_transactions: String(Number(prevData.total_transactions) + payload.transaction),
      };
    });
  }, [ queryClient, setNum ]);

  const channel = useSocketChannel({
    topic: 'transactions:new_transaction',
  });

  useSocketMessage({
    channel,
    event: 'transaction',
    handler: handleNewMessage,
  });

  return (
    <StatsItem
      icon={ txIcon }
      title="Total transactions"
      value={ num.toLocaleString() }
    />
  );
};

export default React.memo(StatsTotalTxs);
