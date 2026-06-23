import type { schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { base } from 'src/slices/block/mocks/details';
import * as tokenMock from 'src/slices/token/mocks/info';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

export const celo: schemas['BlockResponse'] = {
  ...base,
  celo: {
    base_fee: {
      token: tokenMock.tokenInfoERC20a,
      amount: '445690000000000',
      breakdown: [
        {
          address: addressParamMock.withName,
          amount: '356552000000000.0000000000000',
          percentage: 80,
        },
        {
          address: {
            ...addressParamMock.withoutName,
            hash: ZERO_ADDRESS,
          },
          amount: '89138000000000.0000000000000',
          percentage: 20,
        },
      ],
      recipient: addressParamMock.contract,
    },
    epoch_number: 1486,
    l1_era_finalized_epoch_number: 1485,
    is_epoch_block: false,
  },
};
