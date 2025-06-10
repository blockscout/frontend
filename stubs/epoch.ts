import type { CeloEpochListItem } from 'types/api/epochs';

import { TOKEN_TRANSFER_ERC_20_TOTAL } from './token';

export const CELO_EPOCH_ITEM: CeloEpochListItem = {
  timestamp: '2025-06-10T01:27:52.000000Z',
  number: 1739,
  end_block_number: 48563551,
  start_block_number: 48477132,
  distribution: {
    carbon_offsetting_transfer: TOKEN_TRANSFER_ERC_20_TOTAL,
    community_transfer: TOKEN_TRANSFER_ERC_20_TOTAL,
    transfers_total: TOKEN_TRANSFER_ERC_20_TOTAL,
  },
};
