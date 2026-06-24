import type { paths, schemas } from '@blockscout/api-types';
import type {
  TokenType,
} from 'src/slices/token/types/api';

import { ADDRESS_PARAMS, ADDRESS_HASH } from 'src/slices/address/stubs/address-params';

import { generateListStub } from 'src/shared/pagination/utils';

export const BLOCK_HASH = '0x8fa7b9e5e5e79deeb62d608db22ba9a5cb45388c7ebb9223ae77331c6080dc70';

export const TOKEN_INFO_ERC_20: schemas['Token'] = {
  address_hash: ADDRESS_HASH,
  circulating_market_cap: '117629601.61913824',
  decimals: '18',
  exchange_rate: '0.999997',
  holders_count: '16026',
  name: 'Stub Token (goerli)',
  symbol: 'STUB',
  total_supply: '60000000000000000000000',
  type: 'ERC-20',
  icon_url: null,
  reputation: 'ok',
  circulating_supply: null,
  volume_24h: null,
  is_bridged: false,
};

export const TOKEN_INFO_ERC_721: schemas['Token'] = {
  ...TOKEN_INFO_ERC_20,
  circulating_market_cap: null,
  type: 'ERC-721',
};

export const TOKEN_INFO_ERC_1155: schemas['Token'] = {
  ...TOKEN_INFO_ERC_20,
  circulating_market_cap: null,
  type: 'ERC-1155',
};

export const TOKEN_INFO_ERC_404: schemas['Token'] = {
  ...TOKEN_INFO_ERC_20,
  circulating_market_cap: null,
  type: 'ERC-404',
};

export const TOKEN_COUNTERS: schemas['TokenCountersResponse'] = {
  token_holders_count: '123456',
  transfers_count: '123456',
};

export const TOKEN_HOLDER_ERC_20: schemas['TokenHolderResponse'] = {
  address: ADDRESS_PARAMS,
  value: '1021378038331138520',
  token_id: null,
};

export const TOKEN_HOLDER_ERC_1155: schemas['TokenHolderResponse'] = {
  address: ADDRESS_PARAMS,
  token_id: '12345',
  value: '1021378038331138520',
};

export const getTokenHoldersStub = (type?: TokenType | null | undefined, pagination: Record<string, unknown> | null = null):
paths['/v2/tokens/{address_hash_param}/holders']['get'] => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'core:token_holders'>(TOKEN_HOLDER_ERC_20, 50, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'core:token_holders'>(TOKEN_HOLDER_ERC_1155, 50, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'core:token_holders'>(TOKEN_HOLDER_ERC_1155, 50, { next_page_params: pagination });
    default:
      return generateListStub<'core:token_holders'>(TOKEN_HOLDER_ERC_20, 50, { next_page_params: pagination });
  }
};

export const getTokenInstanceHoldersStub = (type?: TokenType | null | undefined, pagination: Record<string, unknown> | null = null):
paths['/v2/tokens/{address_hash_param}/holders']['get'] => {
  switch (type) {
    case 'ERC-721':
      return generateListStub<'core:token_instance_holders'>(TOKEN_HOLDER_ERC_20, 10, { next_page_params: pagination });
    case 'ERC-1155':
      return generateListStub<'core:token_instance_holders'>(TOKEN_HOLDER_ERC_1155, 10, { next_page_params: pagination });
    case 'ERC-404':
      return generateListStub<'core:token_instance_holders'>(TOKEN_HOLDER_ERC_1155, 10, { next_page_params: pagination });
    default:
      return generateListStub<'core:token_instance_holders'>(TOKEN_HOLDER_ERC_20, 10, { next_page_params: pagination });
  }
};

export const TOKEN_INSTANCE: schemas['TokenInstance'] = {
  token: TOKEN_INFO_ERC_721,
  animation_url: null,
  external_app_url: 'https://vipsland.com/nft/collections/genesis/188882',
  id: '188882',
  image_url: 'https://ipfs.vipsland.com/nft/collections/genesis/188882.gif',
  is_unique: true,
  metadata: {
    attributes: Array(3).fill({ trait_type: 'skin tone', value: 'very light skin tone' }),
    description: '**GENESIS #188882**, **8a77ca1bcaa4036f** :: *844th* generation of *#57806 and #57809* :: **eGenetic Hash Code (eDNA)** = *2822355e953a462d*',
    external_url: 'https://vipsland.com/nft/collections/genesis/188882',
    image: 'https://ipfs.vipsland.com/nft/collections/genesis/188882.gif',
    name: 'GENESIS #188882, 8a77ca1bcaa4036f',
  },
  owner: ADDRESS_PARAMS,
  thumbnails: null,
  media_type: null,
  media_url: null,
};
