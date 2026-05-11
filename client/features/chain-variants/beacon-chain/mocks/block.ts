import type { Block } from 'client/slices/block/types/api';

import { base } from 'client/slices/block/mocks/block';

export const withWithdrawals: Block = {
  ...base,
  withdrawals_count: 2,
};
