import type { MudWorldsResponse } from 'client/features/chain-variants/mud/types/api';

import { withName, withoutName } from 'client/slices/address/mocks/address';

export const mudWorlds: MudWorldsResponse = {
  items: [
    {
      address: withName,
      coin_balance: '300000000000000000',
      transactions_count: 3938,
    },
    {
      address: withoutName,
      coin_balance: '0',
      transactions_count: 0,
    },
    {
      address: withoutName,
      coin_balance: '0',
      transactions_count: 0,
    },
  ],
  next_page_params: {
    items_count: 50,
    world: '0x18f01f12ca21b6fc97b917c3e32f671f8a933caa',
  },
};
