// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type ChainInfo = NonNullable<schemas['OptimismInteropMessage']['init_chain']>;

export type MessageStatus = 'Sent' | 'Relayed' | 'Failed';

export interface InteropMessage {
  init_transaction_hash: string;
  init_chain?: ChainInfo | null;
  nonce: number;
  payload: string;
  relay_chain?: ChainInfo | null;
  relay_transaction_hash: string | null;
  sender_address_hash: string;
  status: MessageStatus;
  target_address_hash: string;
  timestamp: string;
}

export interface InteropMessageListResponse {
  items: Array<InteropMessage>;
  next_page_params?: {
    init_transaction_hash: string;
    items_count: number;
    timestamp: number;
  };
}

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
