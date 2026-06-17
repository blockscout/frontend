import type {
  ValidatorBlackfort,
  ValidatorsBlackfortCountersResponse,
  ValidatorsBlackfortResponse,
} from 'src/features/chain-variants/blackfort/types/api';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

export const validator1: ValidatorBlackfort = {
  address: addressParamMock.withName,
  name: 'testnet-3',
  commission: 10,
  delegated_amount: '0',
  self_bonded_amount: '10000',
};

export const validator2: ValidatorBlackfort = {
  address: addressParamMock.withEns,
  name: 'GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG',
  commission: 5000,
  delegated_amount: '10000',
  self_bonded_amount: '100',
};

export const validator3: ValidatorBlackfort = {
  address: addressParamMock.withoutName,
  name: 'testnet-1',
  commission: 0,
  delegated_amount: '0',
  self_bonded_amount: '10000',
};

export const validatorsResponse: ValidatorsBlackfortResponse = {
  items: [ validator1, validator2, validator3 ],
  next_page_params: null,
};

export const validatorsCountersResponse: ValidatorsBlackfortCountersResponse = {
  new_validators_count_24h: '11',
  validators_count: '140',
};
