import type { Transaction } from 'client/slices/tx/types/api';

import { base } from 'client/slices/tx/mocks/tx';

export const l2tx: Transaction = {
  ...base,
  l1_gas_price: '82702201886',
  l1_fee_scalar: '1.0',
  l1_gas_used: '17060',
  l1_fee: '1584574188135760',
  operator_fee: '2769347953',
};
