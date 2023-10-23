import type { ZkEvmL2TxnBatchesResponse } from 'types/api/zkEvmL2TxnBatches';

export const txnBatchesData: ZkEvmL2TxnBatchesResponse = {
  items: [
    {
      timestamp: '2023-06-01T14:46:48.000000Z',
      status: 'Finalized',
      verify_tx_hash: '0x48139721f792d3a68c3781b4cf50e66e8fc7dbb38adff778e09066ea5be9adb8',
      sequence_tx_hash: '0x6aa081e8e33a085e4ec7124fcd8a5f7d36aac0828f176e80d4b70e313a11695b',
      number: 5218590,
      tx_count: 9,
    },
    {
      timestamp: '2023-06-01T14:46:48.000000Z',
      status: 'Unfinalized',
      verify_tx_hash: null,
      sequence_tx_hash: null,
      number: 5218591,
      tx_count: 9,
    },
  ],
  next_page_params: {
    number: 5902834,
    items_count: 50,
  },
};
