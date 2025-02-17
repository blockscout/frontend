import type { TwineL2DepositsItem } from 'types/api/twineL2';

export const TWINE_DEPOSITS_ITEM: TwineL2DepositsItem = {
  tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  nonce: 26,
  chain_id: 17000,
  block_number: 671,
  l1_token: '0x0000000000000000000000000000000000000000',
  l2_token: '0xa8d297d643a11ce83b432e87eebce6bee0fd2bab',
  from: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  to_twine_address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  amount: '1500000000000000000',
  created_at: '2025-02-04T08:00:12.123456Z',
};

export const TWINE_WITHDRAWAL_ITEM: TwineL2DepositsItem = {
  tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  nonce: 26,
  chain_id: 17000,
  block_number: 671,
  l1_token: '0x0000000000000000000000000000000000000000',
  l2_token: '0xa8d297d643a11ce83b432e87eebce6bee0fd2bab',
  from: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  to_twine_address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  amount: '1500000000000000000',
  created_at: '2025-02-04T08:00:12.123456Z',
};
