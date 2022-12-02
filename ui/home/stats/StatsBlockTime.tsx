import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import clockIcon from 'icons/clock-light.svg';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import StatsItem from './StatsItem';

interface Props {
  value: number;
}

const StatsBlockTime = ({ value }: Props) => {
  const queryClient = useQueryClient();

  const handleNewMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.homeStats ], (prevData: HomeStats | undefined) => {
      if (!prevData) {
        return;
      }

      return {
        ...prevData,
        average_block_time: Number(payload.average_block_time),
      };
    });
  }, [ queryClient ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
  });

  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewMessage,
  });

  return (
    <StatsItem
      icon={ clockIcon }
      title="Average block time"
      value={ `${ (value / 1000).toFixed(1) } s` }
    />
  );
};

export default React.memo(StatsBlockTime);
