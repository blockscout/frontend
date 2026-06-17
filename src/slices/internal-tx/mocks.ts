import type { operations, schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { toAddressModel } from 'src/slices/address/utils/model';

export const base: schemas['InternalTransaction'] = {
  block_number: 29611822,
  created_contract: null,
  error: null,
  from: {
    ...addressParamMock.withoutName,
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
  },
  gas_limit: '757586',
  index: 1,
  success: true,
  timestamp: '2022-10-10T14:43:05.000000Z',
  to: {
    ...addressParamMock.withoutName,
    hash: '0x502a9C8af2441a1E276909405119FaE21F3dC421',
    is_contract: true,
    is_verified: true,
    name: 'ArianeeCreditHistory',
  },
  transaction_hash: '0xe9e27dfeb183066e26cfe556f74b7219b08df6951e25d14003d4fc7af8bbff61',
  type: 'call',
  value: '42000000000000000000',
  transaction_index: 0,
};

export const typeStaticCall: schemas['InternalTransaction'] = {
  ...base,
  type: 'staticcall',
  to: toAddressModel({
    ...base.to,
    name: null,
  }),
  gas_limit: '63424243',
  transaction_hash: '0xe9e27dfeb183066e26cfe556f74b7219b08df6951e25d14003d4fc7af8bbff62',
};

export const withContractCreated: schemas['InternalTransaction'] = {
  ...base,
  type: 'delegatecall',
  to: null,
  from: {
    ...base.from,
    name: null,
  },
  created_contract: {
    ...addressParamMock.withoutName,
    hash: '0xdda21946FF3FAa027104b15BE6970CA756439F5a',
    is_contract: true,
    name: 'Shavuha token',
  },
  value: '1420000000000000000',
  gas_limit: '5433',
  transaction_hash: '0xe9e27dfeb183066e26cfe556f74b7219b08df6951e25d14003d4fc7af8bbff63',
};

export const baseResponse:
operations['InternalTransactionController.internal_transactions']['json'] = {
  items: [
    base,
    typeStaticCall,
    withContractCreated,
  ],
  next_page_params: null,
};
