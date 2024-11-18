import type { AddressParam } from './addressParams';

export type WithdrawalsResponse = {
  items: Array<WithdrawalsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
};

export type WithdrawalsItem = {
  amount: string;
  block_number: number;
  index: number;
  receiver: AddressParam;
  timestamp: string;
  validator_index: number;
};

export type WithdrawalsCounters = {
  withdrawal_count: string;
  withdrawal_sum: string;
};
