import type { TokenHolders } from 'types/api/token';

import { withName, withoutName } from 'mocks/address/address';

export const tokenHolders: TokenHolders = {
  items: [
    {
      address: withName,
      value: '107014805905725000000',
    },
    {
      address: withoutName,
      value: '207014805905725000000',
    },
  ],
  next_page_params: {
    value: '50',
    items_count: 50,
  },
};
