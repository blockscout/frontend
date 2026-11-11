import type { schemas } from '@blockscout/api-types';

import { base } from 'src/slices/tx/mocks/details';

export const scrollTxn: schemas['TransactionResponse'] = {
  ...base,
  scroll: {
    l1_base_fee: 9216,
    l1_blob_base_fee: 1,
    l1_fee: '1270219620966',
    l1_fee_blob_scalar: 36905,
    l1_fee_commit_scalar: 47136,
    l1_fee_overhead: 0,
    l1_fee_scalar: 1,
    l1_gas_used: 2340,
    l2_block_status: 'Committed',
    l2_fee: {
      type: 'actual',
      value: '3016808044000',
    },
    queue_index: 104,
  },
};
