import type { HotContractsResponse } from './types/api';

import { contract1, contract2 } from 'client/slices/contract/mocks/list';

export const hotContractsResponse: HotContractsResponse = {
  items: [
    {
      contract_address: { ...contract1.address, name: null, reputation: 'scam' },
      balance: '1000000000000000000',
      transactions_count: '1000',
      total_gas_used: '100000000',
    },
    {
      contract_address: {
        ...contract2.address,
        metadata: {
          reputation: null,
          tags: [
            { tagType: 'protocol', name: 'Goose', slug: 'goose', ordinal: 1, meta: null },
          ],
        },
      },
      balance: '420',
      transactions_count: '42',
      total_gas_used: '12343566',
    },
  ],
  next_page_params: {
    items_count: '50',
    transactions_count: '50',
    total_gas_used: '50',
    contract_address_hash: '50',
  },
};
