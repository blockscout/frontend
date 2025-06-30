import type { Transaction } from './transaction';

export const VIA_L2_TX_BATCH_STATUSES = [
  'Processed on L2' as const,
  'Sealed on L2' as const,
  'Sent to L1' as const,
  'Validated on L1' as const,
  'Executed on L1' as const,
];

export type ViaBatchStatus = typeof VIA_L2_TX_BATCH_STATUSES[number];

export interface ViaBatchesItem {
  commit_transaction_hash: string | null;
  commit_transaction_timestamp: string | null;
  execute_transaction_hash: string | null;
  execute_transaction_timestamp: string | null;
  number: number;
  prove_transaction_hash: string | null;
  prove_transaction_timestamp: string | null;
  status: ViaBatchStatus;
  timestamp: string;
  transactions_count: number;
}

export type ViaBatchesResponse = {
  items: Array<ViaBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
};

export interface ViaBatch extends Omit<ViaBatchesItem, 'transactions_count'> {
  start_block_number: number;
  end_block_number: number;
  l1_gas_price: string;
  l1_transactions_count: number;
  l2_fair_gas_price: string;
  l2_transactions_count: number;
  root_hash: string;
}

export type ViaBatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};
