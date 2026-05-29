import type { Block } from 'src/slices/block/types/api';

import * as addressMock from 'src/slices/address/mocks/address';
import { base } from 'src/slices/block/mocks/block';
import * as tokenMock from 'src/slices/token/mocks/info';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

export const celo: Block = {
  ...base,
  celo: {
    base_fee: {
      token: tokenMock.tokenInfoERC20a,
      amount: '445690000000000',
      breakdown: [
        {
          address: addressMock.withName,
          amount: '356552000000000.0000000000000',
          percentage: 80,
        },
        {
          address: {
            ...addressMock.withoutName,
            hash: ZERO_ADDRESS,
          },
          amount: '89138000000000.0000000000000',
          percentage: 20,
        },
      ],
      recipient: addressMock.contract,
    },
    epoch_number: 1486,
    l1_era_finalized_epoch_number: 1485,
  },
};
