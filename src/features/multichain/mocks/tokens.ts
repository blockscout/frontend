import type { AddressTokenItem } from 'src/features/multichain/types/client';

import { erc7984Token } from 'src/features/fhe-operations/mocks/token';

import { chainA, chainB, chainC } from './chains';

export const tokenAA: AddressTokenItem = {
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
    },
    reputation: null,
    ui_multiplier: null,
    new_ui_multiplier: null,
    ui_multiplier_effective_at: null,
  },
  token_instance: null,
  token_id: null,
  value: '1038000000',
  chain_values: {
    [chainA.id]: '1038000000',
  },
};

export const tokenAB: AddressTokenItem = {
  token: {
    address_hash: '0x0000000000000000000000000000000000000000',
    circulating_market_cap: '274743626781.043515906',
    decimals: '18',
    holders_count: null,
    icon_url: null,
    name: 'Ether',
    symbol: 'ETH',
    total_supply: null,
    type: 'NATIVE',
    exchange_rate: '2276.37',
    chain_infos: {
      [chainA.id]: {
        holders_count: undefined,
        total_supply: undefined,
        is_verified: false,
        contract_name: undefined,
      },
    },
    reputation: null,
    ui_multiplier: null,
    new_ui_multiplier: null,
    ui_multiplier_effective_at: null,
  },
  token_id: null,
  value: '32115625288281011210',
  chain_values: {
    [chainA.id]: '32115625288281011210',
  },
  token_instance: null,
};

export const tokenBA: AddressTokenItem = {
  ...tokenAA,
  token: {
    ...tokenAA.token,
    exchange_rate: '420.42',
    chain_infos: {
      [chainB.id]: {
        holders_count: '5021',
        total_supply: '100000000000000002',
        is_verified: true,
        contract_name: 'TestnetERC20',
      },
    },
  },
  chain_values: {
    [chainB.id]: '42042000',
  },
  value: '42042000',
};

export const tokenBB: AddressTokenItem = {
  ...tokenAA,
  token: {
    ...erc7984Token,
    type: 'ERC-7984',
    chain_infos: {
      [chainB.id]: {
        holders_count: '1250',
        total_supply: '100000000000000002',
        is_verified: true,
        contract_name: 'Confidential USDT',
      },
    },
    reputation: null,
  },
  chain_values: {
    [chainB.id]: null,
  },
  value: null,
};

export const tokenCA: AddressTokenItem = {
  ...tokenBA,
  token: {
    ...tokenBA.token,
    symbol: 'DUCK',
    name: 'Duckie Duck Duck',
    exchange_rate: '242.11',
    chain_infos: {
      [chainC.id]: {
        holders_count: '1250',
        total_supply: '100000000000000002',
        is_verified: true,
        contract_name: 'Duck Duck Goose',
      },
    },
  },
  value: '897000',
  chain_values: {
    [chainC.id]: '897000',
  },
};

export const tokenDA: AddressTokenItem = {
  ...tokenCA,
  token: {
    ...tokenCA.token,
    symbol: 'GOOSE',
    name: 'Mega Goose',
    exchange_rate: null,
  },
};

export const tokenBC: AddressTokenItem = {
  ...tokenAA,
  token: {
    ...tokenAA.token,
    address_hash: '0x7336D3B609bAc510842d7F7Ceb61bcB6910f501D',
    name: 'Caterpillar Inc 3.7% 2028',
    symbol: '14913UBF6',
    decimals: '18',
    type: 'ERC-8056',
    exchange_rate: '1.02',
    ui_multiplier: '1250000000000000000',
    new_ui_multiplier: null,
    ui_multiplier_effective_at: null,
    chain_infos: {
      [chainB.id]: {
        holders_count: '4',
        total_supply: '9692016594070863347712',
        is_verified: false,
        contract_name: undefined,
      },
    },
  },
  value: '4987401008000000000000',
  chain_values: {
    [chainB.id]: '4987401008000000000000',
  },
};
