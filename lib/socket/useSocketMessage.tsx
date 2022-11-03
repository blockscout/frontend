import { useEffect, useRef } from 'react';

import type { SocketMessageParams } from 'lib/socket/types';

export default function useSocketMessage({ channel, event, handler }: SocketMessageParams) {
  const handlerFun = useRef(handler);
  handlerFun.current = handler;

  useEffect(() => {
    if (channel === undefined) {
      return;
    }

    const ref = channel.on(event, (message) => {
      handlerFun.current?.(message);
    });

    return () => {
      channel.off(event, ref);
    };
  }, [ channel, event ]);
}
