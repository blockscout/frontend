import type { TransactionFee } from 'client/slices/tx/types/api';
import type { ScrollL2BlockStatus } from 'types/api/scrollL2';

export interface TransactionScroll {
  scroll?: {
    l1_fee: string;
    l2_fee: TransactionFee;
    l1_fee_commit_scalar: number;
    l1_base_fee: number;
    l1_blob_base_fee: number;
    l1_fee_scalar: number;
    l1_fee_overhead: number;
    l1_fee_blob_scalar: number;
    l1_gas_used: number;
    l2_block_status: ScrollL2BlockStatus;
    queue_index: number;
  };
}
