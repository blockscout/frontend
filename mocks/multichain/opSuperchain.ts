import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { AddressTokenItem } from 'types/client/multichain-aggregator';
import type { ClusterChainConfig } from 'types/multichain';

export const chainDataA = {
  slug: 'op-mainnet',
  name: 'OP Mainnet',
  id: '420',
  logo: 'https://example.com/logo_s.png',
  explorer_url: 'https://op-mainnet.com',
  app_config: {
    app: {
      baseUrl: 'https://op-mainnet.com',
    },
    chain: {
      currency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.op-mainnet.com',
      ],
    },
    apis: {
      general: {
        host: 'localhost',
        protocol: 'http',
        port: '4003',
        endpoint: 'http://localhost:4003',
        socketEndpoint: 'ws://localhost:3200',
      },
    },
    features: {
      csvExport: {
        isEnabled: true,
        reCaptcha: { siteKey: 'xxx' },
      },
      advancedFilter: {
        isEnabled: true,
      },
    },
  },
} as ClusterChainConfig;

export const chainDataB = {
  ...chainDataA,
  id: '421',
  name: 'OP Testnet',
  logo: 'https://example.com/logo_md.png',
  slug: 'op-testnet',
  explorer_url: 'https://op-testnet.com',
  app_config: {
    ...chainDataA.app_config,
    app: {
      baseUrl: 'https://op-testnet.com',
    },
    apis: {
      general: {
        ...chainDataA.app_config?.apis?.general,
        port: '4004',
        endpoint: 'http://localhost:4004',
      },
    },
  },
} as ClusterChainConfig;

export const chainDataC = {
  ...chainDataA,
  id: '422',
  name: 'OP Devnet',
  slug: 'op-devnet',
  explorer_url: 'https://op-devnet.com',
  logo: undefined,
  app_config: {
    ...chainDataA.app_config,
    app: {
      baseUrl: 'https://op-devnet.com',
    },
    apis: {
      general: {
        ...chainDataA.app_config?.apis?.general,
        port: '4005',
        endpoint: 'http://localhost:4005',
      },
    },
  },
} as ClusterChainConfig;

export const addressA: multichain.GetAddressResponse = {
  hash: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  chain_infos: {
    '420': {
      coin_balance: '33298149965862412288',
      is_contract: false,
      is_verified: false,
      contract_name: undefined,
    },
    '421': {
      coin_balance: '1836931848855642237',
      is_contract: true,
      is_verified: false,
      contract_name: undefined,
    },
    '422': {
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
      '420': {
        holders_count: '1250',
        total_supply: '184529257047384791',
        is_verified: true,
        contract_name: 'TestnetERC20',
      },
      '421': {
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
    '420': {
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
};

export const searchAddressesB: multichain.GetAddressResponse = {
  hash: '0x00883b68A6EcF2ea3D47BD735E5125a0B7625B53',
  chain_infos: {
    '420': {
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
    '420': {
      holders_count: '1148927',
      total_supply: '1000000',
      is_verified: false,
      contract_name: undefined,
    },
  },
};
