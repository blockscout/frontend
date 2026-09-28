import type { paths } from '@blockscout/api-types';

export const tokenUiMultiplierChanges: paths['/api/v2/tokens/{address_hash_param}/ui-multiplier-changes']['get'] = {
  items: [
    {
      block_hash: '0x7c8bcc1ace3fc67b97acb73d0fd861f2834e4361c0589843682ee55f3fd991d3',
      block_number: 11387790,
      effective_at: '2022-11-20T00:00:00.000000Z',
      log_index: 12,
      new_multiplier: '1250000000000000000',
      old_multiplier: '1040000000000000000',
      timestamp: '2022-11-11T10:00:00.000000Z',
      transaction_hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
    },
    {
      block_hash: '0x7c8bcc1ace3fc67b97acb73d0fd861f2834e4361c0589843682ee55f3fd991d3',
      block_number: 11387767,
      effective_at: '2022-11-10T08:47:48.000000Z',
      log_index: 738,
      new_multiplier: '1040000000000000000',
      old_multiplier: '1050000000000000000',
      timestamp: '2022-11-10T06:48:36.000000Z',
      transaction_hash: '0x95cbc393f1e43ee417383c56c921e40106f09c77c3657ff024c8c2db6f35f1a4',
    },
    {
      block_hash: '0x7c8bcc1ace3fc67b97acb73d0fd861f2834e4361c0589843682ee55f3fd991d3',
      block_number: 11387767,
      effective_at: '2022-11-10T06:48:36.000000Z',
      log_index: 737,
      new_multiplier: '1050000000000000000',
      old_multiplier: '1000000000000000000',
      timestamp: '2022-11-10T06:48:36.000000Z',
      transaction_hash: null,
    },
  ],
  next_page_params: null,
};

export const tokenUiMultiplierChangesOverflow: paths['/api/v2/tokens/{address_hash_param}/ui-multiplier-changes']['get'] = {
  items: Array.from({ length: 7 }, (_, index) => ({
    ...tokenUiMultiplierChanges.items[1],
    block_number: tokenUiMultiplierChanges.items[1].block_number - index,
    log_index: index,
  })),
  next_page_params: null,
};
