import type { AddressParam } from './addressParams';

export type L2WithdrawalsItem = {
  'challenge_period_end': string | null;
  'from': AddressParam | null;
  'l1_tx_hash': string | null;
  'l2_timestamp': string | null;
  'l2_tx_hash': string;
  'msg_nonce': number;
  'msg_nonce_version': number;
  'status': string;
}

export const WITHDRAWAL_STATUSES = [
  'Waiting for state root',
  'Ready to prove',
  'In challenge period',
  'Ready for relay',
  'Relayed',
] as const;

export type L2WithdrawalStatus = typeof WITHDRAWAL_STATUSES[number];

export type L2WithdrawalsResponse = {
  items: Array<L2WithdrawalsItem>;
  'next_page_params': {
    'items_count': number;
    'nonce': string;
  };
}
