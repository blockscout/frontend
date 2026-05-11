import type { ArbitrumBatchStatus, ArbitrumL2TxData } from 'types/api/arbitrumL2';

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
