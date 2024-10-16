import type {
  ValidatorStability,
  ValidatorsStabilityCountersResponse,
  ValidatorBlackfort,
  ValidatorsBlackfortCountersResponse,
} from 'types/api/validators';

import { ADDRESS_PARAMS } from './addressParams';

export const VALIDATOR_STABILITY: ValidatorStability = {
  address: ADDRESS_PARAMS,
  blocks_validated_count: 25987,
  state: 'active',
};

export const VALIDATORS_STABILITY_COUNTERS: ValidatorsStabilityCountersResponse = {
  active_validators_counter: '42',
  active_validators_percentage: 7.14,
  new_validators_counter_24h: '11',
  validators_counter: '140',
};

export const VALIDATOR_BLACKFORT: ValidatorBlackfort = {
  address: ADDRESS_PARAMS,
  name: 'testnet-1',
  commission: 10,
  delegated_amount: '0',
  self_bonded_amount: '10000',
};

export const VALIDATORS_BLACKFORT_COUNTERS: ValidatorsBlackfortCountersResponse = {
  new_validators_counter_24h: '11',
  validators_counter: '140',
};
