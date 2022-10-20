import type { AddressParam } from './addressParams';
import type { DecodedInput } from './decodedInput';
import type { Fee } from './fee';
import type { TokenTransfer } from './tokenTransfer';

export type TransactionRevertReason = {
  raw: string;
  decoded: string;
} | DecodedInput;

export interface Transaction {
  hash: string;
  result: string;
  confirmations: number;
  status: 'ok' | 'error' | null;
  block: number | null;
  timestamp: string | null;
  confirmation_duration: Array<number>;
  from: AddressParam;
  to: AddressParam;
  created_contract: AddressParam;
  value: string;
  fee: Fee;
  gas_price: number;
  type: number;
  gas_used: string | null;
  gas_limit: string;
  max_fee_per_gas: number | null;
  max_priority_fee_per_gas: number | null;
  priority_fee: number | null;
  base_fee_per_gas: number | null;
  tx_burnt_fee: number | null;
  nonce: number;
  position: number;
  revert_reason: TransactionRevertReason | null;
  raw_input: string;
  decoded_input: DecodedInput | null;
  token_transfers: Array<TokenTransfer> | null;
  token_transfers_overflow: boolean;
  exchange_rate: string;
  tx_tag: string | null;
}

export interface TransactionsResponse {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  };
}
