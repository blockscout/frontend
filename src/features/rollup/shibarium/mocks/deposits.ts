import type { ShibariumDepositsResponse } from 'src/features/rollup/shibarium/types/api';

import { withoutName } from 'src/slices/address/mocks/address-param';

export const data: ShibariumDepositsResponse = {
  items: [
    {
      l1_block_number: 8382841,
      timestamp: '2022-05-27T01:13:48.000000Z',
      l1_transaction_hash: '0xaf3e5f4ef03eac22a622b3434c5dc9f4465aa291900a86bcf0ad9fb14429f05e',
      user: {
        ...withoutName,
        hash: '0x6197d1eef304eb5284a0f6720f79403b4e9bf3a5',
      },
      l2_transaction_hash: '0xb9212c76069b926917816767e4c5a0ef80e519b1ac1c3d3fb5818078f4984667',
    },
    {
      l1_block_number: 8382841,
      timestamp: '2022-05-27T01:13:48.000000Z',
      l1_transaction_hash: '0xaf3e5f4ef03eac22a622b3434c5dc9f4465aa291900a86bcf0ad9fb14429f05e',
      user: {
        ...withoutName,
        hash: '0x6197d1eef304eb5284a0f6720f79403b4e9bf3a5',
      },
      l2_transaction_hash: '0xb9212c76069b926917816767e4c5a0ef80e519b1ac1c3d3fb5818078f4984667',
    },
    {
      l1_block_number: 8382841,
      timestamp: '2022-05-27T01:13:48.000000Z',
      l1_transaction_hash: '0xaf3e5f4ef03eac22a622b3434c5dc9f4465aa291900a86bcf0ad9fb14429f05e',
      user: {
        ...withoutName,
        hash: '0x6197d1eef304eb5284a0f6720f79403b4e9bf3a5',
      },
      l2_transaction_hash: '0xb9212c76069b926917816767e4c5a0ef80e519b1ac1c3d3fb5818078f4984667',
    },
  ],
  next_page_params: {
    items_count: 50,
    block_number: 8382363,
  },
};
