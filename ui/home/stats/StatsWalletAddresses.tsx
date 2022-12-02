import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import walletIcon from 'icons/wallet.svg';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import StatsItem from './StatsItem';

interface Props {
  value: string;
}

const StatsWalletAddresses = ({ value }: Props) => {
  const queryClient = useQueryClient();

  const handleNewMessage: SocketMessage.NewAddressCount['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.homeStats ], (prevData: HomeStats | undefined) => {
      if (!prevData) {
        return;
      }

      return {
        ...prevData,
        total_addresses: payload.count,
      };
    });
  }, [ queryClient ]);

  const channel = useSocketChannel({
    topic: 'addresses:new_address',
  });

  useSocketMessage({
    channel,
    event: 'count',
    handler: handleNewMessage,
  });

  return (
    <StatsItem
      icon={ walletIcon }
      title="Wallet addresses"
      value={ Number(value).toLocaleString() }
    />
  );
};

export default React.memo(StatsWalletAddresses);
