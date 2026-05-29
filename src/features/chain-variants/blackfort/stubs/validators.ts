import type {
  ValidatorBlackfort,
  ValidatorsBlackfortCountersResponse,
} from 'src/features/chain-variants/blackfort/types/api';

import { ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';

export const VALIDATOR_BLACKFORT: ValidatorBlackfort = {
  address: ADDRESS_PARAMS,
  name: 'testnet-1',
  commission: 10,
  delegated_amount: '0',
  self_bonded_amount: '10000',
};

export const VALIDATORS_BLACKFORT_COUNTERS: ValidatorsBlackfortCountersResponse = {
  new_validators_count_24h: '11',
  validators_count: '140',
};
