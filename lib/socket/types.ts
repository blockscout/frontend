import type { Channel } from 'phoenix';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { NewBlockSocketResponse } from 'types/api/block';
import type { TokenTransfer } from 'types/api/tokenTransfer';
import type { Transaction } from 'types/api/transaction';

export type SocketMessageParams = SocketMessage.NewBlock |
SocketMessage.BlocksIndexStatus |
SocketMessage.InternalTxsIndexStatus |
SocketMessage.TxStatusUpdate |
SocketMessage.NewTx |
SocketMessage.NewPendingTx |
SocketMessage.AddressBalance |
SocketMessage.AddressCurrentCoinBalance |
SocketMessage.AddressTokenBalance |
SocketMessage.AddressCoinBalance |
SocketMessage.AddressTxs |
SocketMessage.AddressTxsPending |
SocketMessage.AddressTokenTransfer |
SocketMessage.TokenTransfers |
SocketMessage.ContractVerification |
SocketMessage.Unknown;

interface SocketMessageParamsGeneric<Event extends string | undefined, Payload extends object | unknown> {
  channel: Channel | undefined;
  event: Event;
  handler: (payload: Payload) => void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketMessage {
  export type NewBlock = SocketMessageParamsGeneric<'new_block', NewBlockSocketResponse>;
  export type BlocksIndexStatus = SocketMessageParamsGeneric<'block_index_status', {finished: boolean; ratio: string}>;
  export type InternalTxsIndexStatus = SocketMessageParamsGeneric<'internal_txs_index_status', {finished: boolean; ratio: string}>;
  export type TxStatusUpdate = SocketMessageParamsGeneric<'collated', NewBlockSocketResponse>;
  export type NewTx = SocketMessageParamsGeneric<'transaction', { transaction: number }>;
  export type NewPendingTx = SocketMessageParamsGeneric<'pending_transaction', { pending_transaction: number }>;
  export type AddressBalance = SocketMessageParamsGeneric<'balance', { balance: string; block_number: number; exchange_rate: string }>;
  export type AddressCurrentCoinBalance =
  SocketMessageParamsGeneric<'current_coin_balance', { coin_balance: string; block_number: number; exchange_rate: string }>;
  export type AddressTokenBalance = SocketMessageParamsGeneric<'token_balance', { block_number: number }>;
  export type AddressCoinBalance = SocketMessageParamsGeneric<'coin_balance', { coin_balance: AddressCoinBalanceHistoryItem }>;
  export type AddressTxs = SocketMessageParamsGeneric<'transaction', { transaction: Transaction }>;
  export type AddressTxsPending = SocketMessageParamsGeneric<'pending_transaction', { transaction: Transaction }>;
  export type AddressTokenTransfer = SocketMessageParamsGeneric<'token_transfer', { token_transfer: TokenTransfer }>;
  export type TokenTransfers = SocketMessageParamsGeneric<'token_transfer', {token_transfer: number }>;
  export type ContractVerification = SocketMessageParamsGeneric<'verification_result', unknown>;
  export type Unknown = SocketMessageParamsGeneric<undefined, unknown>;
}
