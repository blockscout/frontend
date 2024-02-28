/* eslint-disable max-len */
import type { Transaction } from 'types/api/transaction';

import { publicTag, privateTag, watchlistName } from 'mocks/address/tag';
import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import * as decodedInputDataMock from 'mocks/txs/decodedInputData';

export const base: Transaction = {
  base_fee_per_gas: '10000000000',
  block: 29611750,
  confirmation_duration: [
    0,
    6364,
  ],
  confirmations: 508299,
  created_contract: null,
  decoded_input: decodedInputDataMock.withoutIndexedFields,
  exchange_rate: '0.00254428',
  fee: {
    type: 'actual',
    value: '7143168000000000',
  },
  from: {
    hash: '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9',
    implementation_name: null,
    is_contract: false,
    name: null,
    is_verified: null,
    private_tags: [ ],
    public_tags: [ publicTag ],
    watchlist_names: [],
    ens_domain_name: 'kitty.kitty.cat.eth',
  },
  gas_limit: '800000',
  gas_price: '48000000000',
  gas_used: '148816',
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  max_fee_per_gas: '40190625000',
  max_priority_fee_per_gas: '28190625000',
  method: 'updateSmartAsset',
  nonce: 27831,
  position: 7,
  priority_fee: '1299672384375000',
  raw_input: '0xfa4b78b90000000000000000000000000000000000000000000000000000000005001bcfe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791000000000000000000000000a79b29ad7e0196c95b87f4663ded82fbf2e3add8',
  result: 'success',
  revert_reason: null,
  status: 'ok',
  timestamp: '2022-10-10T14:34:30.000000Z',
  to: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_contract: false,
    is_verified: true,
    name: null,
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
    ens_domain_name: null,
  },
  token_transfers: [],
  token_transfers_overflow: false,
  tx_burnt_fee: '461030000000000',
  tx_tag: null,
  tx_types: [
    'contract_call',
  ],
  type: 2,
  value: '42000000000000000000',
  actions: [],
  has_error_in_internal_txs: false,
};

export const withWatchListNames: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
  from: {
    ...base.from,
    watchlist_names: [
      { label: 'from #1', display_name: 'from utka' },
      { label: 'kitty', display_name: 'kitty kitty kitty cat where are you' },
    ],
  },
  to: {
    ...base.to,
    watchlist_names: [ { label: 'to #1', display_name: 'to utka' } ],
  } as Transaction['to'],
};

export const withContractCreation: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3195',
  to: null,
  created_contract: {
    hash: '0xdda21946FF3FAa027104b15BE6970CA756439F5a',
    implementation_name: null,
    is_contract: true,
    is_verified: null,
    name: 'Shavuha token',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
  },
  tx_types: [
    'contract_creation',
  ],
};

export const withTokenTransfer: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3196',
  to: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
    ens_domain_name: null,
  },
  token_transfers: [
    tokenTransferMock.erc20,
    tokenTransferMock.erc721,
    tokenTransferMock.erc1155A,
    tokenTransferMock.erc1155B,
    tokenTransferMock.erc1155C,
    tokenTransferMock.erc1155D,
  ],
  token_transfers_overflow: true,
  tx_types: [
    'token_transfer',
  ],
};

export const withDecodedRevertReason: Transaction = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    method_call: 'SomeCustomError(address addr, uint256 balance)',
    method_id: '50289a9f',
    parameters: [
      {
        name: 'addr',
        type: 'address',
        value: '0xf26594f585de4eb0ae9de865d9053fee02ac6ef1',
      },
      {
        name: 'balance',
        type: 'uint256',
        value: '123',
      },
    ],
  },
};

export const withRawRevertReason: Transaction = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    raw: '4f6e6c79206368616972706572736f6e2063616e206769766520726967687420746f20766f74652e',
  },
  to: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_verified: true,
    is_contract: true,
    name: 'Bad guy',
    private_tags: [ ],
    public_tags: [],
    watchlist_names: [ ],
    ens_domain_name: null,
  },
};

export const pending: Transaction = {
  ...base,
  base_fee_per_gas: null,
  block: null,
  confirmation_duration: [],
  confirmations: 0,
  decoded_input: null,
  gas_used: null,
  max_fee_per_gas: null,
  max_priority_fee_per_gas: null,
  method: null,
  position: null,
  priority_fee: null,
  result: 'pending',
  revert_reason: null,
  status: null,
  timestamp: null,
  tx_burnt_fee: null,
  tx_tag: null,
  type: null,
  value: '0',
};

export const withActionsUniswap: Transaction = {
  ...base,
  actions: [
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '7143.488560357232097378',
        amount1: '10',
        symbol0: 'Ring ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem',
        symbol1: 'Ether',
      },
      protocol: 'uniswap_v3',
      type: 'mint',
    },
    {
      data: {
        address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
        ids: [
          '53699',
          '53700123456',
          '42',
        ],
        name: 'Uniswap V3: Positions NFT',
        symbol: 'UNI-V3-POS',
        to: '0x6d872Fb5F5B2B1f71fA9AadE159bc3976c1946B7',
      },
      protocol: 'uniswap_v3',
      type: 'mint_nft',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42876.488560357232',
        amount1: '345.908098203434',
        symbol0: 'SHAVUHA',
        symbol1: 'BOB',
      },
      protocol: 'uniswap_v3',
      type: 'swap',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42',
        amount1: '0.523523223232',
        symbol0: 'VIC',
        symbol1: 'USDT',
      },
      protocol: 'uniswap_v3',
      type: 'burn',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42',
        amount1: '0.523523223232',
        symbol0: 'BOB',
        symbol1: 'UNI',
      },
      protocol: 'uniswap_v3',
      type: 'collect',
    },
  ],
};

export const l2tx: Transaction = {
  ...base,
  l1_gas_price: '82702201886',
  l1_fee_scalar: '1.0',
  l1_gas_used: '17060',
  l1_fee: '1584574188135760',
};

export const stabilityTx: Transaction = {
  ...base,
  stability_fee: {
    dapp_address: {
      hash: '0xDc2B93f3291030F3F7a6D9363ac37757f7AD5C43',
      implementation_name: null,
      is_contract: false,
      is_verified: null,
      name: null,
      private_tags: [],
      public_tags: [],
      watchlist_names: [],
      ens_domain_name: null,
    },
    dapp_fee: '34381250000000',
    token: {
      address: '0xDc2B93f3291030F3F7a6D9363ac37757f7AD5C43',
      circulating_market_cap: null,
      decimals: '18',
      exchange_rate: '123.567',
      holders: '92',
      icon_url: null,
      name: 'Stability Gas',
      symbol: 'GAS',
      total_supply: '10000000000000000000000000',
      type: 'ERC-20',
    },
    total_fee: '68762500000000',
    validator_address: {
      hash: '0x1432997a4058acbBe562F3c1E79738c142039044',
      implementation_name: null,
      is_contract: false,
      is_verified: null,
      name: null,
      private_tags: [],
      public_tags: [],
      watchlist_names: [],
      ens_domain_name: null,
    },
    validator_fee: '34381250000000',
  },
};

export const base2 = {
  ...base,
  hash: '0x02d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  from: {
    ...base.from,
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
  },
};

export const base3 = {
  ...base,
  hash: '0x12d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  from: {
    ...base.from,
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
  },
};

export const base4 = {
  ...base,
  hash: '0x22d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
};
