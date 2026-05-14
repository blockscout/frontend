// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

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
  withdrawals_count: string;
  withdrawals_sum: string;
};
