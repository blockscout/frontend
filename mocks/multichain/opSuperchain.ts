import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { AddressTokenItem } from 'types/client/multichain-aggregator';

import { chainA, chainB, chainC } from './chains';

export const domainProtocols: Array<multichain.ProtocolInfo> = [
  {
    id: 'goose',
    short_name: 'GOOSE',
    title: 'Goose Name Service',
    description: 'The Goose Name Service is a decentralized naming system for the Goose blockchain.',
    deployment_blockscout_base_url: 'https://blockscout.com',
    tld_list: [ 'goose' ],
    icon_url: 'https://goose.com/icon.jpg',
    docs_url: 'https://goose.com/docs',
  },
  {
    id: 'duck',
    short_name: 'DUCK',
    title: 'Duck Name Service',
    description: 'The Duck Name Service is a decentralized naming system for the Duck blockchain.',
    deployment_blockscout_base_url: 'https://blockscout.com',
    tld_list: [ 'duck', 'quack' ],
    icon_url: 'https://duck.com/icon.jpg',
    docs_url: 'https://duck.com/docs',
  },
];

export const addressA: multichain.GetAddressResponse = {
  hash: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  chain_infos: {
    [chainA.id]: {
      coin_balance: '33298149965862412288',
      is_contract: false,
      is_verified: false,
      contract_name: undefined,
    },
    [chainB.id]: {
      coin_balance: '1836931848855642237',
      is_contract: true,
      is_verified: false,
      contract_name: undefined,
    },
    [chainC.id]: {
      coin_balance: '0',
      is_contract: true,
      is_verified: true,
      contract_name: 'Test Contract',
    },
  },
  has_tokens: true,
  has_interop_message_transfers: false,
  coin_balance: '35135081814718054525',
  exchange_rate: '123.455',
  domains: [
    { name: 'ga-ga-ga.goose', protocol: domainProtocols[0] },
    { name: 'quack-quack.duck', protocol: domainProtocols[1] },
  ],
};

export const tokenA: AddressTokenItem = {
  token: {
    address_hash: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    circulating_market_cap: '10.01',
    decimals: '6',
    holders_count: '1250',
    icon_url: null,
    name: 'USDT',
    symbol: 'USDT',
    total_supply: '284529257047384793',
    type: 'ERC-20',
    exchange_rate: '123.456',
    chain_infos: {
      [chainA.id]: {
        holders_count: '1250',
        total_supply: '184529257047384791',
        is_verified: true,
        contract_name: 'TestnetERC20',
      },
      [chainB.id]: {
        holders_count: '1250',
        total_supply: '100000000000000002',
        is_verified: true,
        contract_name: 'TestnetERC20',
      },
    },
    reputation: null,
  },
  token_instance: null,
  token_id: null,
  value: '9038000000',
  chain_values: {
    '420': '1038000000',
    '421': '8000000000',
  },
};

export const searchAddressesA: multichain.GetAddressResponse = {
  hash: '0x0000000002C5fE54822a1eD058AE2F937Fd42769',
  chain_infos: {
    [chainA.id]: {
      coin_balance: '0',
      is_contract: false,
      is_verified: false,
      contract_name: undefined,
    },
  },
  has_tokens: false,
  has_interop_message_transfers: false,
  coin_balance: '0',
  exchange_rate: '123.456',
  domains: [],
};

export const searchAddressesB: multichain.GetAddressResponse = {
  hash: '0x00883b68A6EcF2ea3D47BD735E5125a0B7625B53',
  chain_infos: {
    [chainA.id]: {
      coin_balance: '0',
      is_contract: true,
      is_verified: true,
      contract_name: 'USDT',
    },
  },
  has_tokens: false,
  has_interop_message_transfers: false,
  coin_balance: '0',
  exchange_rate: '123.456',
  domains: [],
};

export const searchTokenA: multichain.AggregatedTokenInfo = {
  address_hash: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  circulating_market_cap: '162513452583.22',
  decimals: '6',
  holders_count: '1148927',
  icon_url: undefined,
  name: 'Tether USD',
  symbol: 'USDT',
  total_supply: '1000000',
  type: 'ERC-20' as multichain.TokenType,
  exchange_rate: '1.00',
  chain_infos: {
    [chainA.id]: {
      holders_count: '1148927',
      total_supply: '1000000',
      is_verified: false,
      contract_name: undefined,
    },
  },
};

export const addressDomainsA: multichain.LookupAddressDomainsResponse = {
  items: [
    { name: 'ga-ga-ga.goose', protocol: domainProtocols[0] },
    { name: 'quack-quack.duck', protocol: domainProtocols[1] },
  ],
  next_page_params: undefined,
};
