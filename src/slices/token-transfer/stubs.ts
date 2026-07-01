import type { paths, schemas } from '@blockscout/api-types';
import type { TokenType } from 'src/slices/token/types/api';

import { ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';
import {
  BLOCK_HASH,
  TOKEN_INFO_ERC_20,
  TOKEN_INFO_ERC_721,
  TOKEN_INFO_ERC_1155,
  TOKEN_INFO_ERC_404,
} from 'src/slices/token/stubs';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

import { generateListStub } from 'src/shared/pagination/utils';

export const TOKEN_TRANSFER_ERC_20_TOTAL: schemas['TokenTransferTotalFungible'] = {
  decimals: '18',
  value: '9851351626684503',
};

export const TOKEN_TRANSFER_ERC_20: schemas['TokenTransfer'] = {
  block_hash: BLOCK_HASH,
  block_number: 123456,
  from: ADDRESS_PARAMS,
  log_index: 4,
  method: 'addLiquidity',
  timestamp: '2022-06-24T10:22:11.000000Z',
  to: ADDRESS_PARAMS,
  token: TOKEN_INFO_ERC_20,
  total: TOKEN_TRANSFER_ERC_20_TOTAL,
  transaction_hash: TX_HASH,
  type: 'token_minting',
  token_type: 'ERC-20',
};

export const TOKEN_TRANSFER_ERC_721: schemas['TokenTransfer'] = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_721,
};

export const TOKEN_TRANSFER_ERC_1155: schemas['TokenTransfer'] = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    value: '123',
    decimals: '18',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_1155,
};

export const TOKEN_TRANSFER_ERC_404: schemas['TokenTransfer'] = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    value: '123',
    decimals: '18',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_404,
};

export const getTokenTransfersStub = (type?: TokenType | null, pagination: Record<string, unknown> | null = null):
paths['/api/v2/token-transfers']['get'] => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'core:token_transfers'>(TOKEN_TRANSFER_ERC_721, 50, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'core:token_transfers'>(TOKEN_TRANSFER_ERC_1155, 50, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'core:token_transfers'>(TOKEN_TRANSFER_ERC_404, 50, { next_page_params: pagination });
    default:
      return generateListStub<'core:token_transfers'>(TOKEN_TRANSFER_ERC_20, 50, { next_page_params: pagination });
  }
};

export const getTokenInstanceTransfersStub = (
  type?: TokenType | null,
  pagination: Record<string, unknown> | null = null,
): paths['/api/v2/tokens/{address_hash_param}/instances/{token_id_param}/transfers']['get'] => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'core:token_instance_transfers'>(TOKEN_TRANSFER_ERC_721, 10, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'core:token_instance_transfers'>(TOKEN_TRANSFER_ERC_1155, 10, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'core:token_instance_transfers'>(TOKEN_TRANSFER_ERC_404, 10, { next_page_params: pagination });
    default:
      return generateListStub<'core:token_instance_transfers'>(TOKEN_TRANSFER_ERC_20, 10, { next_page_params: pagination });
  }
};
