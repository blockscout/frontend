// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export type ShibariumDepositsItem = {
  l1_block_number: number;
  l1_transaction_hash: string;
  l2_transaction_hash: string;
  timestamp: string;
  user: AddressParam | string;
};

export type ShibariumDepositsResponse = {
  items: Array<ShibariumDepositsItem>;
  next_page_params: {
    items_count: number;
    block_number: number;
  };
};

export type ShibariumWithdrawalsItem = {
  l1_transaction_hash: string;
  l2_block_number: number;
  l2_transaction_hash: string;
  timestamp: string;
  user: AddressParam | string;
};

export type ShibariumWithdrawalsResponse = {
  items: Array<ShibariumWithdrawalsItem>;
  next_page_params: {
    items_count: number;
    block_number: number;
  };
};
