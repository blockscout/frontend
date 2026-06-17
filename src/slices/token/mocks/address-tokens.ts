import type { merged, schemas } from '@blockscout/api-types';

import * as tokens from 'src/slices/token/mocks/info';
import * as tokenInstance from 'src/slices/token/mocks/instance';

export const erc20a: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC20a,
  token_id: null,
  value: '1169321234567891234567891',
  token_instance: null,
};

export const erc20b: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC20b,
  token_id: null,
  value: '872500000000',
  token_instance: null,
};

export const erc20c: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC20c,
  token_id: null,
  value: '9852000000000000000000',
  token_instance: null,
};

export const erc20d: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC20d,
  token_id: null,
  value: '39000000000000000000',
  token_instance: null,
};

export const erc20LongSymbol: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC20LongSymbol,
  token_id: null,
  value: '39000000000000000000',
  token_instance: null,
};

export const erc20BigAmount: schemas['TokenBalance'] = {
  token: {
    ...tokens.tokenInfoERC20LongSymbol,
    exchange_rate: '4200000000',
    name: 'DuckDuckGoose Stable Coin',
  },
  token_id: null,
  value: '39000000000000000000',
  token_instance: null,
};

export const erc721a: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC721a,
  token_id: null,
  value: '51',
  token_instance: null,
};

export const erc721b: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC721b,
  token_id: null,
  value: '1',
  token_instance: null,
};

export const erc721c: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC721c,
  token_id: null,
  value: '5',
  token_instance: null,
};

export const erc721LongSymbol: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC721LongSymbol,
  token_id: null,
  value: '5',
  token_instance: null,
};

export const erc1155a: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC1155a,
  token_id: '42',
  token_instance: tokenInstance.base,
  value: '24',
};

export const erc1155b: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC1155b,
  token_id: '100010000000001',
  token_instance: tokenInstance.base,
  value: '11',
};

export const erc1155withoutName: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC1155WithoutName,
  token_id: '64532245',
  token_instance: tokenInstance.base,
  value: '42',
};

export const erc1155LongId: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC1155b,
  token_id: '483200961027732618117991942553110860267520',
  token_instance: tokenInstance.base,
  value: '42',
};

export const erc404a: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC404,
  token_id: '42',
  token_instance: tokenInstance.base,
  value: '240000000000000',
};

export const erc404b: schemas['TokenBalance'] = {
  token: tokens.tokenInfoERC404,
  token_instance: null,
  value: '11',
  token_id: null,
};

export const erc20List: merged.paths['/v2/addresses/{address_hash_param}/tokens']['get']['responses']['200']['content']['application/json'] = {
  items: [
    erc20a,
    erc20b,
    erc20c,
  ],
  next_page_params: null,
};

export const erc721List: merged.paths['/v2/addresses/{address_hash_param}/tokens']['get']['responses']['200']['content']['application/json'] = {
  items: [
    erc721a,
    erc721b,
    erc721c,
  ],
  next_page_params: null,
};

export const erc1155List: merged.paths['/v2/addresses/{address_hash_param}/tokens']['get']['responses']['200']['content']['application/json'] = {
  items: [
    erc1155withoutName,
    erc1155a,
    erc1155b,
  ],
  next_page_params: null,
};

export const erc404List: merged.paths['/v2/addresses/{address_hash_param}/tokens']['get']['responses']['200']['content']['application/json'] = {
  items: [
    erc404a,
    erc404b,
  ],
  next_page_params: null,
};

export const nfts: merged.paths['/v2/addresses/{address_hash_param}/nft']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      ...tokenInstance.base,
      token: tokens.tokenInfoERC1155a,
      token_type: 'ERC-1155',
      value: '11',
    },
    {
      ...tokenInstance.unique,
      token: tokens.tokenInfoERC721a,
      token_type: 'ERC-721',
      value: '1',
    },
    {
      ...tokenInstance.unique,
      token: tokens.tokenInfoERC404,
      token_type: 'ERC-404',
      value: '11000',
    },
  ],
  next_page_params: null,
};

const nftInstance = {
  ...tokenInstance.base,
  token_type: 'ERC-1155',
  value: '11',
};

const nftInstanceWithoutImage = {
  ...nftInstance,
  image_url: null,
};

export const collections: merged.paths['/v2/addresses/{address_hash_param}/nft/collections']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      token: tokens.tokenInfoERC1155a,
      amount: '100',
      token_instances: Array(5).fill(nftInstanceWithoutImage),
    },
    {
      token: tokens.tokenInfoERC20LongSymbol,
      amount: '100',
      token_instances: Array(5).fill(nftInstanceWithoutImage),
    },
    {
      token: tokens.tokenInfoERC1155WithoutName,
      amount: '1',
      token_instances: [ nftInstanceWithoutImage ],
    },
  ],
  next_page_params: {
    token_contract_address_hash: '123',
    token_type: 'ERC-1155',
  },
};
