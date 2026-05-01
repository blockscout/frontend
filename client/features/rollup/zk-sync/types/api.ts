import type { ZkSyncBatchesItem } from 'types/api/zkSyncL2';

export interface TransactionZkSync {
  zksync?: Omit<ZkSyncBatchesItem, 'number' | 'transactions_count' | 'timestamp'> & {
    batch_number: number | null;
  };
}
