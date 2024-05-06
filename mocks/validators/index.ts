import type { Validator, ValidatorsCountersResponse, ValidatorsResponse } from 'types/api/validators';

import * as addressMock from '../address/address';

export const validator1: Validator = {
  address: addressMock.withName,
  blocks_validated_count: 7334224,
  state: 'active',
};

export const validator2: Validator = {
  address: addressMock.withEns,
  blocks_validated_count: 8937453,
  state: 'probation',
};

export const validator3: Validator = {
  address: addressMock.withoutName,
  blocks_validated_count: 1234,
  state: 'inactive',
};

export const validatorsResponse: ValidatorsResponse = {
  items: [ validator1, validator2, validator3 ],
  next_page_params: null,
};

export const validatorsCountersResponse: ValidatorsCountersResponse = {
  active_validators_counter: '42',
  active_validators_percentage: 7.14,
  new_validators_counter_24h: '11',
  validators_counter: '140',
};
