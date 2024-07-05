import type { Block } from './block';
import type { Transaction } from './transaction';

export type ArbitrumL2MessagesItem = {
  completion_transaction_hash: string | null;
  id: number;
  origination_address: string;
  origination_timestamp: string | null;
  origination_transaction_block_number: number;
  origination_transaction_hash: string;
  status: 'initiated' | 'sent' | 'confirmed' | 'relayed';
}

export type ArbitrumL2MessagesResponse = {
  items: Array<ArbitrumL2MessagesItem>;
  next_page_params: {
    direction: string;
    id: number;
    items_count: number;
  };
}

export type ArbitrumL2TxData = {
  hash: string | null;
  status: string | null;
  timestamp: string | null;
}

type ArbitrumL2BatchCommitmentTx = {
  block_number: number;
  hash: string;
  status: string;
  timestamp: string;
}

export type ArbitrumL2TxnBatchesItem = {
  blocks_count: number;
  commitment_transaction: ArbitrumL2BatchCommitmentTx;
  number: number;
  transactions_count: number;
}

export type ArbitrumL2TxnBatchesResponse = {
  items: Array<ArbitrumL2TxnBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
}

export type ArbitrumL2TxnBatch = {
  after_acc: string;
  before_acc: string;
  commitment_transaction: ArbitrumL2BatchCommitmentTx;
  end_block: number;
  start_block: number;
  number: number;
  transactions_count: number;
}

export type ArbitrumL2BatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

export type ArbitrumL2BatchBlocks = {
  items: Array<Block>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    items_count: number;
  } | null;
}

export const ARBITRUM_L2_TX_BATCH_STATUSES = [
  'Processed on rollup' as const,
  'Sent to base' as const,
  'Confirmed on base' as const,
];

export type ArbitrumBatchStatus = typeof ARBITRUM_L2_TX_BATCH_STATUSES[number];
