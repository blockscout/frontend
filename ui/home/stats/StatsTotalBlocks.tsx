import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import blockIcon from 'icons/block.svg';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import StatsItem from './StatsItem';

interface Props {
  value: string;
}

const StatsTotalBlocks = ({ value }: Props) => {
  const queryClient = useQueryClient();

  const handleNewMessage: SocketMessage.NewBlock['handler'] = React.useCallback(() => {
    queryClient.setQueryData([ QueryKeys.homeStats ], (prevData: HomeStats | undefined) => {
      if (!prevData) {
        return;
      }

      return {
        ...prevData,
        total_blocks: String(Number(prevData.total_blocks) + 1),
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
      icon={ blockIcon }
      title="Total blocks"
      value={ Number(value).toLocaleString() }
    />
  );
};

export default React.memo(StatsTotalBlocks);
