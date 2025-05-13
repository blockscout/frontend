import type { Channel } from 'phoenix';
import { useEffect, useRef, useState } from 'react';

import { useSocket } from './context';

const CHANNEL_REGISTRY: Record<string, { channel: Channel; subscribers: number }> = {};

interface Params {
  topic: string | undefined;
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
      const refs = [ onCloseRef.current, onErrorRef.current ].filter(Boolean);
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
    if (socket === null || isDisabled || !topic) {
      return;
    }

    let ch: Channel;
    if (CHANNEL_REGISTRY[topic]) {
      ch = CHANNEL_REGISTRY[topic].channel;
      CHANNEL_REGISTRY[topic].subscribers++;
      onJoinRef.current?.(ch, '');
    } else {
      ch = socket.channel(topic);
      CHANNEL_REGISTRY[topic] = { channel: ch, subscribers: 1 };
      ch.join()
        .receive('ok', (message) => onJoinRef.current?.(ch, message))
        .receive('error', () => {
          onSocketError?.();
        });
    }

    setChannel(ch);

    return () => {
      if (CHANNEL_REGISTRY[topic]) {
        CHANNEL_REGISTRY[topic].subscribers > 0 && CHANNEL_REGISTRY[topic].subscribers--;
        if (CHANNEL_REGISTRY[topic].subscribers === 0) {
          ch.leave();
          delete CHANNEL_REGISTRY[topic];
        }
      }

      setChannel(undefined);
    };
  }, [ socket, topic, params, isDisabled, onSocketError ]);

  return channel;
}
