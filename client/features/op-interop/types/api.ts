import type { ChainInfo, MessageStatus } from 'types/api/interop';

export interface InteropTransactionInfo {
  nonce: number;
  payload: string;
  init_chain?: ChainInfo | null;
  relay_chain?: ChainInfo | null;
  init_transaction_hash?: string;
  relay_transaction_hash?: string;
  sender_address_hash: string;
  status: MessageStatus;
  target_address_hash: string;
}

export interface TransactionOpInterop {
  op_interop_messages?: Array<InteropTransactionInfo>;
}
