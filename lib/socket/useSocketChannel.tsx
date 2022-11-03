import type { Channel } from 'phoenix';
import { useContext, useEffect, useRef, useState } from 'react';

import notEmpty from 'lib/notEmpty';

import { SocketContext } from './context';

interface Params {
  topic: string;
  params?: object;
  isDisabled: boolean;
  onJoin?: (channel: Channel, message: unknown) => void;
  onSocketClose?: () => void;
  onSocketError?: () => void;
}

export default function useSocketChannel({ topic, params, isDisabled, onJoin, onSocketClose, onSocketError }: Params) {
  const socket = useContext(SocketContext);
  const [ channel, setChannel ] = useState<Channel>();

  const onJoinFun = useRef(onJoin);
  onJoinFun.current = onJoin;

  useEffect(() => {
    const onCloseRef = onSocketClose && socket?.onClose(onSocketClose);
    const onErrorRef = onSocketError && socket?.onClose(onSocketError);

    return () => {
      const refs = [ onCloseRef, onErrorRef ].filter(notEmpty);
      refs.length > 0 && socket?.off(refs);
    };
  }, [ onSocketClose, onSocketError, socket ]);

  useEffect(() => {
    if (isDisabled && channel) {
      channel.leave();
      setChannel(undefined);
    }
  }, [ channel, isDisabled ]);

  useEffect(() => {
    if (socket === null || isDisabled) {
      return;
    }

    const ch = socket.channel(topic, params);
    ch.join().receive('ok', (message) => onJoinFun.current?.(ch, message));
    setChannel(ch);

    return () => {
      ch.leave();
      setChannel(undefined);
    };
  }, [ socket, topic, params, isDisabled ]);

  return channel;
}
