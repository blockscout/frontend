import type { Block } from 'client/slices/block/types/api';

import { base } from 'client/slices/block/mocks/block';

export const withBlobTxs: Block = {
  ...base,
  blob_gas_price: '21518435987',
  blob_gas_used: '393216',
  burnt_blob_fees: '8461393325064192',
  excess_blob_gas: '79429632',
  blob_transactions_count: 1,
};
