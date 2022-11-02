import type { SocketData, SocketChannelSubscriber } from 'lib/socket/types';

import { SECOND } from 'lib/consts';

interface InitParams {
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onClose?: (event: Event) => void;
}

const OPEN_STATE = 1;

class Socket {
  private socket: WebSocket | undefined;
  private heartBeatIntervalId: number | undefined;
  private onReadyEvents: Array<SocketData> = [];
  private channels: Record<string, Array<SocketChannelSubscriber>> = {};

  init({ onOpen, onError, onClose }: InitParams) {
    if (this.socket) {
      return this;
    }

    // todo_tom pass host and base path from config
    this.socket = new WebSocket('wss://blockscout.com/poa/core/socket/v2/websocket?vsn=2.0.0');

    this.socket.addEventListener('open', (event: Event) => {
      this.startHeartBeat();
      onOpen?.(event);

      this.onReadyEvents.forEach((data) => this.socket?.send(JSON.stringify(data)));
      this.onReadyEvents = [];
    });

    this.socket.addEventListener('message', (event) => {
      const data: SocketData = JSON.parse(event.data);

      const channelId = data[2];
      const filterId = data[3];
      const payload = data[4];
      const subscribers = this.channels[channelId];
      subscribers
        ?.filter((subscriber) => subscriber.filters ? subscriber.filters.includes(filterId) : true)
        ?.forEach((subscriber) => subscriber.onMessage(payload));
    });

    this.socket.addEventListener('error', (event) => {
      onError?.(event);
    });

    this.socket.addEventListener('close', (event) => {
      onClose?.(event);
    });

    return this;
  }

  close() {
    window.clearInterval(this.heartBeatIntervalId);
    this.socket?.close();
    this.socket = undefined;
    this.onReadyEvents = [];
    this.channels = {};
  }

  joinRoom(id: string, subscriber: SocketChannelSubscriber) {
    const data: SocketData = [ null, null, id, 'phx_join', {} ];

    if (this.socket?.readyState === OPEN_STATE) {
      this.socket?.send(JSON.stringify(data));
    } else {
      this.onReadyEvents.push(data);
    }

    if (this.channels[id]) {
      this.channels[id].push(subscriber);
    } else {
      this.channels[id] = [ subscriber ];
    }
  }

  leaveRoom(id: string) {
    // todo_tom remove only specified subscriber
    const data: SocketData = [ null, null, id, 'phx_leave', {} ];

    if (this.socket?.readyState === OPEN_STATE) {
      this.socket?.send(JSON.stringify(data));
    } else {
      this.onReadyEvents.push(data);
    }

    this.channels[id] = [];
  }

  private startHeartBeat() {
    this.heartBeatIntervalId = window.setInterval(() => {
      const data: SocketData = [ null, null, 'phoenix', 'heartbeat', {} ];
      this.socket?.send(JSON.stringify(data));
    }, 30 * SECOND);
  }
}

export default Socket;
