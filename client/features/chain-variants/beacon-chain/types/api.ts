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
