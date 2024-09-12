import type {
  OptimismL2TxnBatchTypeCallData,
  OptimismL2TxnBatchTypeCelestia,
  OptimismL2TxnBatchTypeEip4844,
  OptimisticL2TxnBatchesResponse,
} from 'types/api/optimisticL2';

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

export const txnBatchTypeCallData: OptimismL2TxnBatchTypeCallData = {
  batch_data_container: 'in_calldata',
  internal_id: 309123,
  l1_timestamp: '2022-08-10T10:30:24.000000Z',
  l1_tx_hashes: [
    '0x478c45f182631ae6f7249d40f31fdac36f41d88caa2e373fba35340a7345ca67',
  ],
  l2_block_end: 10146784,
  l2_block_start: 10145379,
  tx_count: 1608,
};

export const txnBatchTypeCelestia: OptimismL2TxnBatchTypeCelestia = {
  batch_data_container: 'in_celestia',
  blobs: [
    {
      commitment: '0x39c18c21c6b127d58809b8d3b5931472421f9b51532959442f53038f10b78f2a',
      height: 2584868,
      l1_timestamp: '2024-08-28T16:51:12.000000Z',
      l1_transaction_hash: '0x2bb0b96a8ba0f063a243ac3dee0b2f2d87edb2ba9ef44bfcbc8ed191af1c4c24',
      namespace: '0x00000000000000000000000000000000000000000008e5f679bf7116cb',
    },
  ],
  internal_id: 309667,
  l1_timestamp: '2022-08-28T16:51:12.000000Z',
  l1_tx_hashes: [
    '0x2bb0b96a8ba0f063a243ac3dee0b2f2d87edb2ba9ef44bfcbc8ed191af1c4c24',
  ],
  l2_block_end: 10935879,
  l2_block_start: 10934514,
  tx_count: 1574,
};

export const txnBatchTypeEip4844: OptimismL2TxnBatchTypeEip4844 = {
  batch_data_container: 'in_blob4844',
  blobs: [
    {
      hash: '0x012a4f0c6db6bce9d3d357b2bf847764320bcb0107ab318f3a532f637bc60dfe',
      l1_timestamp: '2022-08-23T03:59:12.000000Z',
      l1_transaction_hash: '0x3870f136497e5501dc20d0974daf379c8636c958794d59a9c90d4f8a9f0ed20a',
    },
    {
      hash: '0x01d1097cce23229931afbc2fd1cf0d707da26df7b39cef1c542276ae718de4f6',
      l1_timestamp: '2022-08-23T03:59:12.000000Z',
      l1_transaction_hash: '0x3870f136497e5501dc20d0974daf379c8636c958794d59a9c90d4f8a9f0ed20a',
    },
  ],
  internal_id: 2538459,
  l1_timestamp: '2022-08-23T03:59:12.000000Z',
  l1_tx_hashes: [
    '0x3870f136497e5501dc20d0974daf379c8636c958794d59a9c90d4f8a9f0ed20a',
  ],
  l2_block_end: 16291502,
  l2_block_start: 16291373,
  tx_count: 704,
};
