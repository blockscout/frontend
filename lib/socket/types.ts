import type { Channel } from 'phoenix';

import type { NewBlockSocketResponse } from 'types/api/block';

export type SocketMessageParams = SocketMessage.NewBlock |
SocketMessage.BlocksIndexStatus |
SocketMessage.TxStatusUpdate;

interface SocketMessageParamsGeneric<Event extends string, Payload extends object> {
  channel: Channel | undefined;
  event: Event;
  handler: (payload: Payload) => void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketMessage {
  export type NewBlock = SocketMessageParamsGeneric<'new_block', NewBlockSocketResponse>;
  export type BlocksIndexStatus = SocketMessageParamsGeneric<'index_status', {finished: boolean; ratio: string}>;
  export type TxStatusUpdate = SocketMessageParamsGeneric<'collated', NewBlockSocketResponse>;
}
