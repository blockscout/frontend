import type { AddressParam } from './addressParams';
import type { PaginationParams } from './pagination';

export type TxInternalsType = 'call' | 'delegatecall' | 'staticcall' | 'create' | 'create2' | 'selfdestruct' | 'reward'

export interface InternalTransaction {
  error: string | null;
  success: boolean;
  type: TxInternalsType;
  transaction_hash: string;
  from: AddressParam;
  to: AddressParam;
  created_contract: AddressParam;
  value: string;
  index: number;
  block: number;
  timestamp: string;
  gas_limit: string;
}

export interface InternalTransactionsResponse {
  items: Array<InternalTransaction>;
  next_page_params: PaginationParams & {
    transaction_hash: string;
    transaction_index: number;
  };
}
