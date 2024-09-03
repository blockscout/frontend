import type { OptimisticL2TxnBatchesResponse } from 'types/api/optimisticL2';

export const txnBatchesData: OptimisticL2TxnBatchesResponse = {
  items: [
    {
      batch_data_container: 'in_blob4844',
      internal_id: 260998,
      l1_timestamp: '2022-11-10T11:29:11.000000Z',
      l1_tx_hashes: [
        '0x9553351f6bd1577f4e782738c087be08697fb11f3b91745138d71ba166d62c3b',
      ],
      l2_block_end: 124882074,
      l2_block_start: 124881833,
      tx_count: 4011,
    },
    {
      batch_data_container: 'in_calldata',
      internal_id: 260997,
      l1_timestamp: '2022-11-03T11:20:59.000000Z',
      l1_tx_hashes: [
        '0x80f5fba70d5685bc2b70df836942e892b24afa7bba289a2fac0ca8f4d554cc72',
      ],
      l2_block_end: 124881832,
      l2_block_start: 124881613,
      tx_count: 4206,
    },
    {
      internal_id: 260996,
      l1_timestamp: '2024-09-03T11:14:23.000000Z',
      l1_tx_hashes: [
        '0x39f4c46cae57bae936acb9159e367794f41f021ed3788adb80ad93830edb5f22',
      ],
      l2_block_end: 124881612,
      l2_block_start: 124881380,
      tx_count: 4490,
    },
  ],
  next_page_params: {
    id: 5902834,
    items_count: 50,
  },
};
