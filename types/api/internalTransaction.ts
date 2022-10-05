import type { AddressParam } from './addressParams';

export type TxInternalsType = 'call' | 'delegatecall' | 'staticcall' | 'create' | 'create2' | 'selfdestruct' | 'reward'

export interface InternalTransaction {
  error?: string;
  success: boolean;
  type: TxInternalsType;
  transaction_hash: string;
  from: AddressParam;
  to: AddressParam;
  created_contract: AddressParam;
  value: number;
  index: number;
  block: number;
  timestamp: string;
}

export interface InternalTransactionsResponse {
  items: Array<InternalTransaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
    transaction_hash: string;
    transaction_index: number;
  };
}
