import type { merged } from '@blockscout/api-types';

import { withName, withoutName } from 'src/slices/address/mocks/address-param';

export const tokenHoldersERC20: merged.paths['/v2/tokens/{address_hash_param}/holders']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      address: withName,
      value: '107014805905725000000',
      token_id: null,
    },
    {
      address: withoutName,
      value: '207014805905725000000',
      token_id: null,
    },
  ],
  next_page_params: {
    value: '50',
    items_count: 50,
  },
};

export const tokenHoldersERC1155: merged.paths['/v2/tokens/{address_hash_param}/holders']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      address: withName,
      value: '107014805905725000000',
      token_id: '12345',
    },
    {
      address: withoutName,
      value: '207014805905725000000',
      token_id: '12345',
    },
  ],
  next_page_params: {
    value: '50',
    items_count: 50,
  },
};
