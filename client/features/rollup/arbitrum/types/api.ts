// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Block } from 'client/slices/block/types/api';
import type { Transaction } from 'client/slices/tx/types/api';

export interface ArbitrumLatestDepositsItem {
  completion_transaction_hash: string;
  origination_timestamp: string | null;
  origination_transaction_block_number: number | null;
  origination_transaction_hash: string | null;
}

export interface ArbitrumLatestDepositsResponse {
  items: Array<ArbitrumLatestDepositsItem>;
}

export type ArbitrumL2MessageStatus = 'initiated' | 'sent' | 'confirmed' | 'relayed';

export type ArbitrumL2MessagesItem = {
  completion_transaction_hash: string | null;
  id: number;
  origination_address_hash: string;
  origination_timestamp: string | null;
  origination_transaction_block_number: number | null;
  origination_transaction_hash: string;
  status: ArbitrumL2MessageStatus;
};

export type ArbitrumL2MessagesResponse = {
  items: Array<ArbitrumL2MessagesItem>;
  next_page_params: {
    direction: string;
    id: number;
    items_count: number;
  };
};

export type ArbitrumL2TxData = {
  hash: string | null;
  status: string | null;
  timestamp: string | null;
};

type ArbitrumL2BatchCommitmentTx = {
  block_number: number;
  hash: string;
  status: string;
  timestamp: string;
};

type BatchDataContainer = 'in_blob4844' | 'in_calldata' | 'in_anytrust' | 'in_celestia' | null;

export type ArbitrumL2TxnBatchesItem = {
  blocks_count: number;
  commitment_transaction: ArbitrumL2BatchCommitmentTx;
  number: number;
  transactions_count: number;
  batch_data_container: BatchDataContainer;
};

export type ArbitrumL2TxnBatchesResponse = {
  items: Array<ArbitrumL2TxnBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
};

export type ArbitrumL2TxnBatchDAAnytrust = {
  batch_data_container: 'in_anytrust';
  bls_signature: string;
  data_hash: string;
  timeout: string;
  signers: Array<{
    key: string;
    trusted: boolean;
    proof?: string;
  }>;
};

export type ArbitrumL2TxnBatchDACelestia = {
  batch_data_container: 'in_celestia';
  height: number;
  transaction_commitment: string;
};

export type ArbitrumL2TxnBatchDataAvailability = ArbitrumL2TxnBatchDAAnytrust | ArbitrumL2TxnBatchDACelestia | {
  batch_data_container: Exclude<BatchDataContainer, 'in_anytrust' | 'in_celestia'>;
};

export type ArbitrumL2TxnBatch = {
  after_acc_hash: string;
  before_acc_hash: string;
  commitment_transaction: ArbitrumL2BatchCommitmentTx;
  end_block_number: number;
  start_block_number: number;
  number: number;
  transactions_count: number;
  data_availability: ArbitrumL2TxnBatchDataAvailability;
};

export type ArbitrumL2BatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};

export type ArbitrumL2BatchBlocks = {
  items: Array<Block>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    items_count: number;
  } | null;
};

export interface ArbitrumL2TxnWithdrawalsItem {
  arb_block_number: number;
  caller_address_hash: string;
  callvalue: string;
  completion_transaction_hash: string | null;
  data: string;
  destination_address_hash: string;
  eth_block_number: number;
  id: number;
  l2_timestamp: number;
  status: ArbitrumL2MessageStatus;
  token: {
    address_hash: string;
    amount: string | null;
    destination_address_hash: string | null;
    name: string | null;
    symbol: string | null;
    decimals: number | null;
  } | null;
}

export interface ArbitrumL2TxnWithdrawalsResponse {
  items: Array<ArbitrumL2TxnWithdrawalsItem>;
}

export interface ArbitrumL2MessageClaimResponse {
  calldata: string;
  outbox_address_hash: string;
}

export const ARBITRUM_L2_TX_BATCH_STATUSES = [
  'Processed on rollup' as const,
  'Sent to base' as const,
  'Confirmed on base' as const,
];

export type ArbitrumBatchStatus = typeof ARBITRUM_L2_TX_BATCH_STATUSES[number];

export type NewArbitrumBatchSocketResponse = { batch: ArbitrumL2TxnBatchesItem };

export type ArbitrumTransactionMessageStatus = 'Relayed' | 'Syncing with base layer' | 'Waiting for confirmation' | 'Ready for relay' | 'Settlement pending';

export interface TransactionArbitrum {
  arbitrum?: {
    batch_number: number;
    commitment_transaction: ArbitrumL2TxData;
    confirmation_transaction: ArbitrumL2TxData;
    contains_message: 'incoming' | 'outcoming' | null;
    gas_used_for_l1: string;
    gas_used_for_l2: string;
    network_fee: string;
    poster_fee: string;
    status: ArbitrumBatchStatus;
    message_related_info: {
      associated_l1_transaction_hash: string | null;
      message_status: ArbitrumTransactionMessageStatus;
    };
  };
}

export interface BlockArbitrum {
  arbitrum?: ArbitrumBlockData;
}

export type ArbitrumBlockData = {
  batch_number: number;
  commitment_transaction: ArbitrumL2TxData;
  confirmation_transaction: ArbitrumL2TxData;
  delayed_messages: number;
  l1_block_number: number;
  send_count: number | null;
  send_root: string;
  status: ArbitrumBatchStatus;
};
