import type { AddressParam } from './addressParams';
import type { DecodedInput } from './decodedInput';
import type { Fee } from './fee';
import type { TokenTransfer } from './tokenTransfer';

export interface Transaction {
  hash: string;
  result: string;
  confirmations: number;
  status: 'ok' | 'error' | null;
  block: number;
  timestamp: string;
  confirmation_duration: Array<number>;
  from: AddressParam;
  to: AddressParam;
  created_contract: AddressParam;
  value: number;
  fee: Fee;
  gas_price: number;
  type: number;
  gas_used: string;
  gas_limit: string;
  max_fee_per_gas?: number;
  max_priority_fee_per_gas?: number;
  priority_fee?: number;
  base_fee_per_gas?: number;
  tx_burnt_fee?: number;
  nonce: number;
  position: number;
  revert_reason?: {
    raw: string;
    decoded: string;
  };
  raw_input: string;
  decoded_input?: DecodedInput;
  token_transfers?: Array<TokenTransfer>;
  token_transfers_overflow: boolean;
  exchange_rate: string;
}

export interface TransactionsResponse {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  };
}
