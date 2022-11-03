import React from 'react';

import type { SocketSubscriber } from 'lib/socket/types';

import Socket from 'lib/socket/Socket';

type Params = SocketSubscriber & {
  isDisabled: boolean;
}

export default function useSocketRoom({ isDisabled, channelId, eventId, onMessage, onClose, onError, hash }: Params) {
  React.useEffect(() => {
    if (isDisabled) {
      return;
    }

    const room = {
      channelId,
      eventId,
      onMessage,
      onClose,
      onError,
      hash,
    } as SocketSubscriber;

    const socket = (new Socket).init();
    socket.joinRoom(room);

    return () => {
      socket.leaveRoom(room);
      socket.close();
    };
  }, [ channelId, eventId, hash, isDisabled, onClose, onError, onMessage ]);
}
