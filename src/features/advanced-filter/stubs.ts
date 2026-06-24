// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

export const ADVANCED_FILTER_ITEM: schemas['AdvancedFilterItem'] = {
  fee: '215504444616317',
  from: ADDRESS_PARAMS,
  hash: TX_HASH,
  method: 'approve',
  timestamp: '2022-11-11T11:11:11.000000Z',
  to: ADDRESS_PARAMS,
  token: null,
  total: null,
  type: 'coin_transfer',
  value: '42000420000000000000',
  block_number: 0,
  internal_transaction_index: null,
  transaction_index: 0,
  created_contract: null,
  status: 'ok',
  token_transfer_batch_index: null,
  token_transfer_index: null,
};
