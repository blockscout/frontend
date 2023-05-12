import { ADDRESS_PARAMS, ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

export const PRIVATE_TAG_ADDRESS = {
  address: ADDRESS_PARAMS,
  address_hash: ADDRESS_HASH,
  id: '4',
  name: 'placeholder',
};

export const PRIVATE_TAG_TX = {
  id: 1,
  name: 'placeholder',
  transaction_hash: TX_HASH,
};

export const PUBLIC_TAG = {
  additional_comment: 'my comment',
  addresses: [ ADDRESS_HASH ],
  addresses_with_info: [ ADDRESS_PARAMS ],
  company: null,
  email: 'john.doe@example.com',
  full_name: 'name',
  id: 1,
  is_owner: true,
  submission_date: '2022-11-11T11:11:11.000000Z',
  tags: 'placeholder',
  website: null,
};
