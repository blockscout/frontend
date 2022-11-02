import type { SocketData, SocketSubscriber } from 'lib/socket/types';

import appConfig from 'configs/app/config';
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
  private channels: Record<string, Array<SocketSubscriber>> = {};

  init({ onOpen, onError, onClose }: InitParams | undefined = {}) {
    if (this.socket) {
      return this;
    }

    this.socket = new WebSocket(`${ appConfig.api.socket }${ appConfig.api.basePath }/socket/v2/websocket?vsn=2.0.0`);

    this.socket.addEventListener('open', (event: Event) => {
      this.startHeartBeat();
      onOpen?.(event);

      this.onReadyEvents.forEach((data) => this.socket?.send(JSON.stringify(data)));
      this.onReadyEvents = [];
    });

    this.socket.addEventListener('message', (event) => {
      const data: SocketData = JSON.parse(event.data);

      const channelId = data[2];
      const eventId = data[3];
      const payload = data[4];
      const subscribers = this.channels[channelId];
      subscribers
        ?.filter((subscriber) => subscriber.eventId ? subscriber.eventId === eventId : true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.forEach((subscriber) => subscriber.onMessage(payload as any));
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

  joinRoom(subscriber: SocketSubscriber) {
    const channelId = this.getChannelId(subscriber.channelId, subscriber.hash);
    const data: SocketData = [ null, null, channelId, 'phx_join', {} ];

    if (this.socket?.readyState === OPEN_STATE) {
      this.socket?.send(JSON.stringify(data));
    } else {
      this.onReadyEvents.push(data);
    }

    if (this.channels[channelId]) {
      this.channels[channelId].push(subscriber);
    } else {
      this.channels[channelId] = [ subscriber ];
    }
  }

  leaveRoom(subscriber: SocketSubscriber) {
    const channelId = this.getChannelId(subscriber.channelId, subscriber.hash);
    const data: SocketData = [ null, null, channelId, 'phx_leave', {} ];

    if (this.socket?.readyState === OPEN_STATE) {
      this.socket?.send(JSON.stringify(data));
    } else {
      this.onReadyEvents.push(data);
    }

    this.channels[channelId]?.filter(({ onMessage }) => onMessage !== subscriber.onMessage);
  }

  private startHeartBeat() {
    this.heartBeatIntervalId = window.setInterval(() => {
      const data: SocketData = [ null, null, 'phoenix', 'heartbeat', {} ];
      this.socket?.send(JSON.stringify(data));
    }, 30 * SECOND);
  }

  private getChannelId(pattern: string, hash?: string) {
    if (!hash) {
      return pattern;
    }

    return pattern.replace('[hash]', hash);
  }
}

export default Socket;
