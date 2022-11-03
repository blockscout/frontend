import type { SocketData, SocketSubscriber } from 'lib/socket/types';

import appConfig from 'configs/app/config';
import { SECOND } from 'lib/consts';

const OPEN_STATE = 1;

class Socket {
  private socket: WebSocket | undefined;
  private heartBeatIntervalId: number | undefined;
  private lastHeartBeatTs: number | undefined;
  private onReadyEvents: Array<SocketData> = [];
  private channels: Record<string, Array<SocketSubscriber>> = {};

  private HEART_BEAT_INTERVAL = 30 * SECOND;

  private handleOpen = () => {
    this.startHeartBeat();

    this.onReadyEvents.forEach((data) => this.socket?.send(JSON.stringify(data)));
    this.onReadyEvents = [];
  };

  private handleMessage = (event: MessageEvent) => {
    const data: SocketData = JSON.parse(event.data);

    const channelId = data[2];
    const eventId = data[3];
    const payload = data[4];
    const subscribers = this.channels[channelId];
    subscribers
      ?.filter((subscriber) => subscriber.eventId ? subscriber.eventId === eventId : true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.forEach((subscriber) => subscriber.onMessage(payload as any));

    if (channelId === 'phoenix' && eventId === 'phx_reply') {
      const isOk = (payload as { status?: string } | undefined)?.status === 'ok';
      isOk && (this.lastHeartBeatTs = Date.now());
    }
  };

  private handleClose = () => {
    this.beforeClose();
    this.afterClose();
  };

  private handleError = () => {
    Object.values(this.channels).forEach((channel) => channel.forEach((subscriber) => subscriber.onError?.()));
  };

  init() {
    if (this.socket) {
      return this;
    }

    this.socket = new WebSocket(`${ appConfig.api.socket }${ appConfig.api.basePath }/socket/v2/websocket?vsn=2.0.0`);

    this.socket.addEventListener('open', this.handleOpen);
    this.socket.addEventListener('message', this.handleMessage);
    this.socket.addEventListener('error', this.handleError);
    this.socket.addEventListener('close', this.handleClose);

    return this;
  }

  close() {
    this.beforeClose();
    this.socket?.close();
    this.afterClose();
  }

  beforeClose() {
    window.clearInterval(this.heartBeatIntervalId);

    this.socket?.removeEventListener('open', this.handleOpen);
    this.socket?.removeEventListener('message', this.handleMessage);
    this.socket?.removeEventListener('error', this.handleError);
    this.socket?.removeEventListener('close', this.handleClose);

    if (this.socket?.readyState === OPEN_STATE) {
      Object.values(this.channels).forEach((channel) => channel.forEach((subscriber) => subscriber.onClose?.()));
    }
  }

  afterClose() {
    this.socket = undefined;
    this.onReadyEvents = [];
    this.channels = {};
    this.lastHeartBeatTs = undefined;
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
      if (this.socket?.readyState !== OPEN_STATE) {
        return;
      }

      if (this.lastHeartBeatTs && Date.now() - this.lastHeartBeatTs > this.HEART_BEAT_INTERVAL) {
        // if we didn't receive response to the last heartbeat
        this.close();
        return;
      }

      const data: SocketData = [ null, null, 'phoenix', 'heartbeat', {} ];
      this.socket?.send(JSON.stringify(data));
    }, this.HEART_BEAT_INTERVAL);
  }

  private getChannelId(pattern: string, hash?: string) {
    if (!hash) {
      return pattern;
    }

    return pattern.replace('[hash]', hash.toLowerCase());
  }
}

export default Socket;
