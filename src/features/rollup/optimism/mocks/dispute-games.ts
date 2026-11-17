import type { operations } from '@blockscout/api-types';

export const data: operations['OptimismController.games']['json'] = {
  items: [
    {
      contract_address_hash: '0x5cbe1b88b6357e6a8f0821bea72cc0b88c231f1c',
      created_at: '2022-05-27T01:13:48.000000Z',
      game_type: 0,
      index: 6662,
      l2_block_number: 12542890,
      l2_timestamp: '2022-05-27T01:13:00.000000Z',
      resolved_at: null,
      status: 'In progress',
    },
    {
      contract_address_hash: '0x5cbe1b88b6357e6a8f0821bea72cc0b88c231f1c',
      created_at: '2022-05-27T01:13:48.000000Z',
      game_type: 0,
      index: 6662,
      l2_block_number: 12542890,
      l2_timestamp: '2022-05-27T01:13:00.000000Z',
      resolved_at: '2022-05-27T01:13:48.000000Z',
      status: 'Defender wins',
    },
    {
      contract_address_hash: '0x5cbe1b88b6357e6a8f0821bea72cc0b88c231f1c',
      created_at: '2022-05-27T01:13:48.000000Z',
      game_type: 9,
      index: 6663,
      l2_block_number: null,
      l2_timestamp: '2022-05-27T01:10:00.000000Z',
      resolved_at: null,
      status: 'In progress',
    },
  ],
  next_page_params: {
    items_count: 50,
    index: 8382363,
  },
};
