import type { Erc20TotalPayload, TokenTransfer, TokenTransferPagination, TokenTransferResponse } from 'client/slices/token-transfer/types/api';
import type { TokenType, TokenInstanceTransferPagination, TokenInstanceTransferResponse } from 'client/slices/token/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';
import {
  BLOCK_HASH,
  TOKEN_INFO_ERC_20,
  TOKEN_INFO_ERC_721,
  TOKEN_INFO_ERC_1155,
  TOKEN_INFO_ERC_404,
} from 'client/slices/token/stubs';
import { TX_HASH } from 'client/slices/tx/stubs/tx';

import { generateListStub } from 'stubs/utils';

export const TOKEN_TRANSFER_ERC_20_TOTAL: Erc20TotalPayload = {
  decimals: '18',
  value: '9851351626684503',
};

export const TOKEN_TRANSFER_ERC_20: TokenTransfer = {
  block_hash: BLOCK_HASH,
  block_number: '123456',
  from: ADDRESS_PARAMS,
  log_index: '4',
  method: 'addLiquidity',
  timestamp: '2022-06-24T10:22:11.000000Z',
  to: ADDRESS_PARAMS,
  token: TOKEN_INFO_ERC_20,
  total: TOKEN_TRANSFER_ERC_20_TOTAL,
  transaction_hash: TX_HASH,
  type: 'token_minting',
  token_type: 'ERC-20',
};

export const TOKEN_TRANSFER_ERC_721: TokenTransfer = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_721,
};

export const TOKEN_TRANSFER_ERC_1155: TokenTransfer = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    value: '123',
    decimals: '18',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_1155,
};

export const TOKEN_TRANSFER_ERC_404: TokenTransfer = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    value: '123',
    decimals: '18',
    token_instance: null,
  },
  token: TOKEN_INFO_ERC_404,
};

export const getTokenTransfersStub = (type?: TokenType, pagination: TokenTransferPagination | null = null): TokenTransferResponse => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'general:token_transfers'>(TOKEN_TRANSFER_ERC_721, 50, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'general:token_transfers'>(TOKEN_TRANSFER_ERC_1155, 50, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'general:token_transfers'>(TOKEN_TRANSFER_ERC_404, 50, { next_page_params: pagination });
    default:
      return generateListStub<'general:token_transfers'>(TOKEN_TRANSFER_ERC_20, 50, { next_page_params: pagination });
  }
};

export const getTokenInstanceTransfersStub = (type?: TokenType, pagination: TokenInstanceTransferPagination | null = null): TokenInstanceTransferResponse => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'general:token_instance_transfers'>(TOKEN_TRANSFER_ERC_721, 10, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'general:token_instance_transfers'>(TOKEN_TRANSFER_ERC_1155, 10, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'general:token_instance_transfers'>(TOKEN_TRANSFER_ERC_404, 10, { next_page_params: pagination });
    default:
      return generateListStub<'general:token_instance_transfers'>(TOKEN_TRANSFER_ERC_20, 10, { next_page_params: pagination });
  }
};
