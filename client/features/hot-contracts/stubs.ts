import type { HotContract } from './types/api';

import { VERIFIED_CONTRACT_INFO } from 'client/slices/contract/stubs';

export const HOT_CONTRACTS: HotContract = {
  contract_address: VERIFIED_CONTRACT_INFO.address,
  balance: '1000000000000000000',
  transactions_count: '1000',
  total_gas_used: '100000000',
};
