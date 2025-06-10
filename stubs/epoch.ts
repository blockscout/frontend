import type { CeloEpochListItem, CeloEpochDetails } from 'types/api/epochs';

import { BLOCK_HASH } from './block';
import { TOKEN_INFO_ERC_20, TOKEN_TRANSFER_ERC_20, TOKEN_TRANSFER_ERC_20_TOTAL } from './token';

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

export const CELO_EPOCH: CeloEpochDetails = {
  timestamp: '2025-06-10T01:27:52.000000Z',
  number: 1739,
  start_processing_block_hash: BLOCK_HASH,
  end_processing_block_hash: BLOCK_HASH,
  end_block_number: 48563551,
  start_block_number: 48477132,
  distribution: {
    carbon_offsetting_transfer: TOKEN_TRANSFER_ERC_20,
    community_transfer: TOKEN_TRANSFER_ERC_20,
    transfers_total: {
      token: TOKEN_INFO_ERC_20,
      total: TOKEN_TRANSFER_ERC_20_TOTAL,
    },
  },
  end_processing_block_number: 48563552,
  start_processing_block_number: 48563546,
};
