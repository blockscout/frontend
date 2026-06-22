import type { schemas } from '@blockscout/api-types';

export const verifiedContractsCountersMock: schemas['SmartContractCounters'] = {
  smart_contracts: '123456789',
  new_smart_contracts_24h: '12345',
  verified_smart_contracts: '654321',
  new_verified_smart_contracts_24h: '0',
};
