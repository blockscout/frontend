import type { ValidatorsZilliqaItem, ValidatorsZilliqaResponse } from 'types/api/validators';

export const validator1: ValidatorsZilliqaItem = {
  index: 420,
  bls_public_key: '0x95125dca41be848801f9bd75254f1faf1ae3194b1da53e9a5684ed7f67b729542482bc521924603b9703c33bf831a100',
  balance: '1000000000000000000',
};

export const validatorsResponse: ValidatorsZilliqaResponse = {
  items: [ validator1 ],
  next_page_params: null,
};
