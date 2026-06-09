import type { Block } from 'src/slices/block/types/api';

import { base } from 'src/slices/block/mocks/block';

export const withWithdrawals: Block = {
  ...base,
  withdrawals_count: 2,
};
