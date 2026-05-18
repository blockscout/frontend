// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export type BlockWithdrawalsResponse = {
  items: Array<BlockWithdrawalsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  } | null;
};

export type BlockWithdrawalsItem = {
  amount: string;
  index: number;
  receiver: AddressParam;
  validator_index: number;
};

export type DepositStatus = 'pending' | 'invalid' | 'completed';

export type DepositsResponse = {
  items: Array<DepositsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  } | null;
};

export type DepositsItem = {
  amount: string;
  block_number: number;
  block_hash: string;
  block_timestamp: string;
  index: number;
  pubkey: string;
  signature: string;
  status: DepositStatus;
  from_address: AddressParam;
  transaction_hash: string;
  withdrawal_address: AddressParam;
};

export type DepositsCounters = {
  deposits_count: string;
};

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
