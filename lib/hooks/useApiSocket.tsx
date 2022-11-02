import React from 'react';

import { SECOND } from 'lib/consts';

const OPEN_STATE = 1;

interface Params {
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onClose?: (event: Event) => void;
}

type SocketData = [ null, null, string, string, Record<string, unknown> ];
interface SocketChannelSubscriber {
  filters?: Array<string>;
  callback: (payload: unknown) => void;
}

export default function useApiSocket({ onOpen, onError, onClose }: Params) {
  const socket = React.useRef<WebSocket>();
  const onReadyEvents = React.useRef<Array<SocketData>>([]);
  const channels = React.useRef<Record<string, Array<SocketChannelSubscriber>>>({});

  function startHeartBeat() {
    return window.setInterval(() => {
      const data: SocketData = [ null, null, 'phoenix', 'heartbeat', {} ];
      socket.current?.send(JSON.stringify(data));
    }, 30 * SECOND);
  }

  const joinRoom = React.useCallback((id: string, subscriber: SocketChannelSubscriber) => {
    const data: SocketData = [ null, null, id, 'phx_join', {} ];

    if (socket.current?.readyState === OPEN_STATE) {
      socket.current?.send(JSON.stringify(data));
    } else {
      onReadyEvents.current.push(data);
    }

    if (channels.current[id]) {
      channels.current[id].push(subscriber);
    } else {
      channels.current[id] = [ subscriber ];
    }
  }, []);

  const leaveRoom = React.useCallback((id: string) => {
    const data: SocketData = [ null, null, id, 'phx_leave', {} ];

    if (socket.current?.readyState === OPEN_STATE) {
      socket.current?.send(JSON.stringify(data));
    } else {
      onReadyEvents.current.push(data);
    }

    channels.current[id] = [];
  }, []);

  React.useEffect(() => {
    if (socket.current) {
      socket.current.close();
    }

    // todo_tom pass host and base path from config
    socket.current = new WebSocket('wss://blockscout.com/poa/core/socket/v2/websocket?vsn=2.0.0');
    let heartBeatTimeoutId: number | undefined;

    socket.current.addEventListener('open', (event: Event) => {
      onOpen?.(event);
      heartBeatTimeoutId = startHeartBeat();

      onReadyEvents.current.forEach((data) => socket.current?.send(JSON.stringify(data)));
      onReadyEvents.current = [];
    });

    socket.current.addEventListener('message', (event) => {
      const data: SocketData = JSON.parse(event.data);

      const channelId = data[2];
      const filterId = data[3];
      const payload = data[4];
      const subscribers = channels.current[channelId];
      subscribers
        ?.filter((subscriber) => subscriber.filters ? subscriber.filters.includes(filterId) : true)
        ?.forEach((subscriber) => subscriber.callback(payload));
    });

    socket.current.addEventListener('error', (event) => {
      onError?.(event);
    });

    socket.current.addEventListener('close', (event) => {
      onClose?.(event);
    });

    return () => {
      window.clearInterval(heartBeatTimeoutId);
      socket.current?.close();
    };
  }, [ onClose, onError, onOpen ]);

  return { joinRoom, leaveRoom };
}
