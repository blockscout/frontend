import type { schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { base } from 'src/slices/tx/mocks/details';

export const suaveTxn: schemas['TransactionResponse'] = {
  ...base,
  execution_node: addressParamMock.withoutName,
  allowed_peekers: [
    '0x5c5b8a2d8a6ef7a2cdd2e4a59d4c06e2f5aee5aa',
    '0x7a3b4b8bf6d7f7a0e2d0c4a5b6f5c6d7e8f9a0b1',
  ],
};
