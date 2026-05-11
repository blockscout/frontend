import type { TokenHolders } from 'client/slices/token/types/api';

import { withName, withoutName } from 'client/slices/address/mocks/address';

export const tokenHoldersERC20: TokenHolders = {
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

export const tokenHoldersERC1155: TokenHolders = {
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
