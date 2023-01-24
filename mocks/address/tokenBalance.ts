import type { AddressTokenBalance } from 'types/api/address';

import * as tokens from 'mocks/tokens/tokenInfo';

export const erc20a: AddressTokenBalance = {
  token: tokens.tokenInfoERC20a,
  token_id: null,
  value: '1169320000000000000000000',
};

export const erc20b: AddressTokenBalance = {
  token: tokens.tokenInfoERC20b,
  token_id: null,
  value: '872500000000',
};

export const erc20c: AddressTokenBalance = {
  token: tokens.tokenInfoERC20c,
  token_id: null,
  value: '9852000000000000000000',
};

export const erc20d: AddressTokenBalance = {
  token: tokens.tokenInfoERC20d,
  token_id: null,
  value: '39000000000000000000',
};

export const erc721a: AddressTokenBalance = {
  token: tokens.tokenInfoERC721a,
  token_id: null,
  value: '51',
};

export const erc721b: AddressTokenBalance = {
  token: tokens.tokenInfoERC721b,
  token_id: null,
  value: '1',
};

export const erc721c: AddressTokenBalance = {
  token: tokens.tokenInfoERC721c,
  token_id: null,
  value: '5',
};

export const erc1155a: AddressTokenBalance = {
  token: tokens.tokenInfoERC1155a,
  token_id: '42',
  value: '24',
};

export const erc1155b: AddressTokenBalance = {
  token: tokens.tokenInfoERC1155b,
  token_id: '100010000000001',
  value: '11',
};

export const erc1155withoutName: AddressTokenBalance = {
  token: tokens.tokenInfoERC1155WithoutName,
  token_id: '64532245',
  value: '42',
};

export const baseList = [
  erc20a,
  erc20b,
  erc20c,
  erc721a,
  erc721b,
  erc721c,
  erc1155withoutName,
  erc1155a,
  erc1155b,
];
