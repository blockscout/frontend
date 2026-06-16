import type { merged } from '@blockscout/api-types';

import { base, base2 } from './details';

export const baseListResponse: merged.paths['/v2/blocks']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      ...base,
      rewards: [
        {
          reward: base.rewards[0].reward,
          type: 'uncle',
        },
        {
          reward: base.rewards[1].reward,
          type: 'validator',
        },
        {
          reward: base.rewards[2].reward,
          type: 'emission_funds',
        },
      ],
    },
    {
      ...base2,
      rewards: [
        {
          reward: base2.rewards[0].reward,
          type: 'uncle',
        },
        {
          reward: base2.rewards[1].reward,
          type: 'validator',
        },
        {
          reward: base2.rewards[2].reward,
          type: 'emission_funds',
        },
      ],
    },
  ],
  next_page_params: null,
};
