import type { operations } from '@blockscout/api-types';

import { contract1, contract2 } from 'src/slices/contract/mocks/list';

export const hotContractsResponse: operations['StatsController.hot_smart_contracts']['json'] = {
  items: [
    {
      contract_address: { ...contract1.address, name: null, reputation: 'scam' },
      balance: '1000000000000000000',
      transactions_count: 1000,
      total_gas_used: 100000000,
    },
    {
      contract_address: {
        ...contract2.address,
        metadata: {
          tags: [
            { tagType: 'protocol', name: 'Goose', slug: 'goose', ordinal: 1, meta: {} },
          ],
        },
      },
      balance: '420',
      transactions_count: 42,
      total_gas_used: 12343566,
    },
  ],
  next_page_params: {
    items_count: '50',
    transactions_count: '50',
    total_gas_used: '50',
    contract_address_hash: '50',
  },
};
