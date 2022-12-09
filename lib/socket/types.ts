import type { Channel } from 'phoenix';

import type { NewBlockSocketResponse } from 'types/api/block';

export type SocketMessageParams = SocketMessage.NewBlock |
SocketMessage.BlocksIndexStatus |
SocketMessage.TxStatusUpdate |
SocketMessage.NewTx |
SocketMessage.NewPendingTx |
SocketMessage.AddressBalanceUpdate |
SocketMessage.AddressCoinBalanceUpdate |
SocketMessage.Unknown;

interface SocketMessageParamsGeneric<Event extends string | undefined, Payload extends object | unknown> {
  channel: Channel | undefined;
  event: Event;
  handler: (payload: Payload) => void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketMessage {
  export type NewBlock = SocketMessageParamsGeneric<'new_block', NewBlockSocketResponse>;
  export type BlocksIndexStatus = SocketMessageParamsGeneric<'index_status', {finished: boolean; ratio: string}>;
  export type TxStatusUpdate = SocketMessageParamsGeneric<'collated', NewBlockSocketResponse>;
  export type NewTx = SocketMessageParamsGeneric<'transaction', { transaction: number }>;
  export type NewPendingTx = SocketMessageParamsGeneric<'pending_transaction', { pending_transaction: number }>;
  export type AddressBalanceUpdate = SocketMessageParamsGeneric<'balance', { balance: string; block_number: number; exchange_rate: string }>;
  export type AddressCoinBalanceUpdate =
  SocketMessageParamsGeneric<'current_coin_balance', { coin_balance: string; block_number: number; exchange_rate: string }>;
  export type Unknown = SocketMessageParamsGeneric<undefined, unknown>;
}
