import type { AddressParam } from './addressParams';

export type OptimisticL2DepositsItem = {
  l1_block_number: number;
  l1_tx_hash: string;
  l1_block_timestamp: string;
  l1_tx_origin: string;
  l2_tx_gas_limit: string;
  l2_tx_hash: string;
}

export type OptimisticL2DepositsResponse = {
  items: Array<OptimisticL2DepositsItem>;
  next_page_params: {
    items_count: number;
    l1_block_number: number;
    tx_hash: string;
  };
}

export type OptimisticL2OutputRootsItem = {
  l1_block_number: number;
  l1_timestamp: string;
  l1_tx_hash: string;
  l2_block_number: number;
  l2_output_index: number;
  output_root: string;
}

export type OptimisticL2OutputRootsResponse = {
  items: Array<OptimisticL2OutputRootsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
}

export type OptimisticL2TxnBatchesItem = {
  l1_tx_hashes: Array<string>;
  l1_timestamp: string;
  l2_block_number: number;
  tx_count: number;
}

export type OptimisticL2TxnBatchesResponse = {
  items: Array<OptimisticL2TxnBatchesItem>;
  next_page_params: {
    block_number: number;
    items_count: number;
  };
}

export type OptimisticL2WithdrawalsItem = {
  'challenge_period_end': string | null;
  'from': AddressParam | null;
  'l1_tx_hash': string | null;
  'l2_timestamp': string | null;
  'l2_tx_hash': string;
  'msg_nonce': number;
  'msg_nonce_version': number;
  'status': string;
}

export const WITHDRAWAL_STATUSES = [
  'Waiting for state root',
  'Ready to prove',
  'In challenge period',
  'Ready for relay',
  'Relayed',
] as const;

export type OptimisticL2WithdrawalStatus = typeof WITHDRAWAL_STATUSES[number];

export type OptimisticL2WithdrawalsResponse = {
  items: Array<OptimisticL2WithdrawalsItem>;
  'next_page_params': {
    'items_count': number;
    'nonce': string;
  };
}
