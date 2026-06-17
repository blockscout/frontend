import type { schemas } from '@blockscout/api-types';

import * as addressParamMocks from 'src/slices/address/mocks/address-param';
import * as inputDataMocks from 'src/slices/log/mocks/decoded-input';

const TOPICS = [
  '0x3a4ec416703c36a61a4b1f690847f1963a6829eac0b52debd40a23b66c142a56',
  '0x0000000000000000000000000000000000000000000000000000000005001bcf',
  '0xe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791',
  null,
];
const DATA = '0x0000000000000000000000000000000000000000000000000070265bf0112cee';

export const base: schemas['Log'] = {
  address: addressParamMocks.withName,
  topics: TOPICS,
  data: DATA,
  transaction_hash: '0x404bd417203769f968aacb1d66211510db86b81303b0c68283b4eb4572e6845c',
  block_timestamp: null,
  block_number: 9005750,
  decoded: inputDataMocks.withIndexedFields,
  index: 42,
  smart_contract: null,
  block_hash: '0x404bd417203769f968aacb1d66211510db86b81303b0c68283b4eb4572e6845c',
};
