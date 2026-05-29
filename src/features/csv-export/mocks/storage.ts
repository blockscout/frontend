import type { StorageItem } from '../utils/storage';

export const itemCompleted = {
  request_id: 'ba3e4b01-7921-4e34-a530-4ac3082b0a92',
  file_id: 'IsPUL6HibKAFhrNs6Mwl',
  status: 'completed',
  expires_at: '2022-11-11T18:22:44Z',
  type: 'address_txs',
  params: {
    from_period: '2026-03-30T18:22:00.000Z',
    to_period: '2026-03-31T18:22:00.000Z',
    hash: '0x774e9146e400D5cAe26aA1C90eee9225FFC2FF51',
  },
  is_highlighted: true,
} satisfies StorageItem;

export const itemPending = {
  request_id: '2e16be21-ac33-40ea-98bf-9c6c4da160f2',
  file_id: null,
  expires_at: null,
  status: 'pending',
  type: 'address_token_transfers',
  params: {
    from_period: '2026-03-30T18:38:00.000Z',
    to_period: '2026-03-31T18:38:00.000Z',
    hash: '0x774e9146e400D5cAe26aA1C90eee9225FFC2FF51',
    filter_type: 'address',
    filter_value: 'to',
  },
  is_highlighted: false,
} satisfies StorageItem;

export const itemFailed = {
  request_id: '6d3b431f-a339-4f66-99d9-264435cdb895',
  file_id: null,
  expires_at: null,
  status: 'failed',
  type: 'advanced_filters',
  params: {
    transaction_types: 'ERC-20,ERC-721,ERC-1155,ERC-404,contract_creation,contract_interaction',
    to_address_hashes_to_include: '0x774e9146e400D5cAe26aA1C90eee9225FFC2FF51',
    created_at: '2026-03-31T18:40:09.159Z',
  },
  is_highlighted: true,
} satisfies StorageItem;

export const itemExpired = {
  request_id: 'd5daa2af-41a6-4f99-a324-7146994e6f47',
  file_id: null,
  expires_at: '2022-11-10T18:22:44Z',
  status: 'pending',
  type: 'token_holders',
  params: {
    hash: '0x63eD0d9139edAF9d4195a4fA0879cb33C0AB8D70',
    token_name: 'R2Credential',
  },
  is_highlighted: false,
} satisfies StorageItem;
