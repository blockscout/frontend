import type {
  ValidatorStability,
  ValidatorsStabilityCountersResponse,
} from 'client/features/chain-variants/stability/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';

export const VALIDATOR_STABILITY: ValidatorStability = {
  address: ADDRESS_PARAMS,
  blocks_validated_count: 25987,
  state: 'active',
};

export const VALIDATORS_STABILITY_COUNTERS: ValidatorsStabilityCountersResponse = {
  active_validators_count: '42',
  active_validators_percentage: 7.14,
  new_validators_count_24h: '11',
  validators_count: '140',
};
