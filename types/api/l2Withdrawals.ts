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

export type L2WithdrawalStatus =
  'In challenge period' |
  'Ready for relay' |
  'Relayed' |
  'Waiting for state root' |
  'Ready to prove';

export type L2WithdrawalsResponse = {
  items: Array<L2WithdrawalsItem>;
  'next_page_params': {
    'items_count': number;
    'nonce': string;
  };
}
