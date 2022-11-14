import type { Channel } from 'phoenix';
import { useEffect, useRef, useState } from 'react';

import notEmpty from 'lib/notEmpty';

import { useSocket } from './context';

interface Params {
  topic: string;
  params?: object;
  isDisabled: boolean;
  onJoin?: (channel: Channel, message: unknown) => void;
  onSocketClose?: () => void;
  onSocketError?: () => void;
}

export default function useSocketChannel({ topic, params, isDisabled, onJoin, onSocketClose, onSocketError }: Params) {
  const socket = useSocket();
  const [ channel, setChannel ] = useState<Channel>();
  const onCloseRef = useRef<string>();
  const onErrorRef = useRef<string>();

  const onJoinRef = useRef(onJoin);
  onJoinRef.current = onJoin;

  useEffect(() => {
    const cleanUpRefs = () => {
      const refs = [ onCloseRef.current, onErrorRef.current ].filter(notEmpty);
      refs.length > 0 && socket?.off(refs);
    };

    if (!isDisabled) {
      onCloseRef.current = onSocketClose && socket?.onClose(onSocketClose);
      onErrorRef.current = onSocketError && socket?.onError(onSocketError);
    } else {
      cleanUpRefs();
    }

    return cleanUpRefs;
  }, [ onSocketClose, onSocketError, socket, isDisabled ]);

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
    ch.join().receive('ok', (message) => onJoinRef.current?.(ch, message));
    setChannel(ch);

    return () => {
      ch.leave();
      setChannel(undefined);
    };
  }, [ socket, topic, params, isDisabled ]);

  return channel;
}
