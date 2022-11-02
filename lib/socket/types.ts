import type { NewBlockSocketResponse } from 'types/api/block';

export type SocketData = [ null, null, string, string, unknown ];

export type SocketSubscriber = SocketSubscribers.BlocksNewBlock |
SocketSubscribers.BlockNewBlock |
SocketSubscribers.BlockNewBlock;

interface SocketSubscriberGeneric<Channel extends string, Event extends string, Payload> {
  channelId: Channel;
  eventId: Event;
  onMessage: (payload: Payload) => void;
  onClose?: () => void;
  onError?: () => void;
  hash?: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketSubscribers {
  export type BlocksNewBlock = SocketSubscriberGeneric<'blocks:new_block', 'new_block', NewBlockSocketResponse>;
  export type BlocksIndexStatus = SocketSubscriberGeneric<'blocks:indexing', 'index_status', {finished: boolean; ratio: string}>;
  export type BlockNewBlock = SocketSubscriberGeneric<'blocks:[hash]', 'new_block', NewBlockSocketResponse>;
}
