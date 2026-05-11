import type { Transaction } from 'client/slices/tx/types/api';

import { base } from 'client/slices/tx/mocks/tx';

export const withBlob: Transaction = {
  ...base,
  blob_gas_price: '21518435987',
  blob_gas_used: '131072',
  blob_versioned_hashes: [
    '0x01a8c328b0370068aaaef49c107f70901cd79adcda81e3599a88855532122e09',
    '0x0197fdb17195c176b23160f335daabd4b6a231aaaadd73ec567877c66a3affd1',
  ],
  burnt_blob_fee: '2820464441688064',
  max_fee_per_blob_gas: '60000000000',
  transaction_types: [ 'blob_transaction' as const ],
  type: 3,
};
