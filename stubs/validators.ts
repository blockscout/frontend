import type { Validator, ValidatorsCountersResponse } from 'types/api/validators';

import { ADDRESS_PARAMS } from './addressParams';

export const VALIDATOR: Validator = {
  address: ADDRESS_PARAMS,
  blocks_validated_count: 25987,
  state: 'active',
};

export const VALIDATORS_COUNTERS: ValidatorsCountersResponse = {
  active_validators_counter: '42',
  active_validators_percentage: 7.14,
  new_validators_counter_24h: '11',
  validators_counter: '140',
};
