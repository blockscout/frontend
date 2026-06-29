import type { schemas } from '@blockscout/api-types';

import { BLOCK_ITEM } from './list';

export const BLOCK: schemas['BlockResponse'] = {
  ...BLOCK_ITEM,
  rewards: [
    {
      reward: '19241635454943109',
      type: 'Miner Reward',
    },
  ],
};
