import type { schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as tokenMock from 'src/slices/token/mocks/info';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

export const base = {
  base_fee_per_gas: '10000000000',
  burnt_fees: '5449200000000000',
  burnt_fees_percentage: 20.292245650793845,
  difficulty: '340282366920938463463374607431768211454',
  gas_limit: '12500000',
  gas_target_percentage: -91.28128,
  gas_used: '544920',
  gas_used_percentage: 4.35936,
  hash: '0xccc75136de485434d578b73df66537c06b34c3c9b12d085daf95890c914fc2bc',
  height: 30146364,
  miner: {
    ...addressParamMock.withoutName,
    hash: '0xdAd49e6CbDE849353ab27DeC6319E687BFc91A41',
    name: 'Alex Emelyanov',
  },
  nonce: '0x0000000000000000',
  parent_hash: '0x44125f0eb36a9d942e0c23bb4e8117f7ba86a9537a69b59c0025986ed2b7500f',
  priority_fee: '23211757500000000',
  rewards: [
    {
      reward: '500000000000000000',
      type: 'POA Mania Reward',
    },
    {
      reward: '1026853607510000000',
      type: 'Validator Reward',
    },
    {
      reward: '500000000000000000',
      type: 'Emission Reward',
    },
  ],
  size: 2448,
  timestamp: '2022-11-11T11:59:35Z',
  total_difficulty: '10258276095980170141167591583995189665817672619',
  transactions_count: 5,
  internal_transactions_count: 12,
  transaction_fees: '26853607500000000',
  type: 'block',
  uncles_hashes: [],
  is_pending_update: false,
  withdrawals_count: 0,
} satisfies schemas['BlockResponse'];

export const genesis = {
  base_fee_per_gas: null,
  burnt_fees: null,
  burnt_fees_percentage: null,
  difficulty: '131072',
  gas_limit: '6700000',
  gas_target_percentage: -100,
  gas_used: '0',
  gas_used_percentage: 0,
  hash: '0x39f02c003dde5b073b3f6e1700fc0b84b4877f6839bb23edadd3d2d82a488634',
  height: 0,
  miner: {
    ...addressParamMock.withoutName,
    hash: '0x0000000000000000000000000000000000000000',
    ens_domain_name: 'kitty.kitty.cat.eth',
  },
  nonce: '0x0000000000000000',
  parent_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  priority_fee: null,
  rewards: [],
  size: 533,
  timestamp: '2017-12-16T00:13:24.000000Z',
  total_difficulty: '131072',
  transactions_count: 0,
  internal_transactions_count: 0,
  transaction_fees: '0',
  type: 'block',
  uncles_hashes: [],
  is_pending_update: false,
  withdrawals_count: 0,
} satisfies schemas['BlockResponse'];

export const base2 = {
  ...base,
  height: base.height - 1,
  size: 592,
  miner: {
    ...addressParamMock.withoutName,
    hash: '0xDfE10D55d9248B2ED66f1647df0b0A46dEb25165',
    name: 'Kiryl Ihnatsyeu',
  },
  timestamp: '2022-11-11T11:46:05Z',
  transactions_count: 253,
  gas_target_percentage: 23.6433,
  gas_used: '6333342',
  gas_used_percentage: 87.859504,
  burnt_fees: '232438000000000000',
  burnt_fees_percentage: 65.3333333333334,
  rewards: [
    {
      reward: '500000000000000000',
      type: 'Chore Reward',
    },
    {
      reward: '1017432850000000000',
      type: 'Miner Reward',
    },
    {
      reward: '500000000000000000',
      type: 'Emission Reward',
    },
  ],
  is_pending_update: true,
} satisfies schemas['BlockResponse'];

export const celo: schemas['BlockResponse'] = {
  ...base,
  celo: {
    base_fee: {
      token: tokenMock.tokenInfoERC20a,
      amount: '445690000000000',
      breakdown: [
        {
          address: addressParamMock.withName,
          amount: '356552000000000.0000000000000',
          percentage: 80,
        },
        {
          address: {
            ...addressParamMock.withoutName,
            hash: ZERO_ADDRESS,
          },
          amount: '89138000000000.0000000000000',
          percentage: 20,
        },
      ],
      recipient: {
        ...addressParamMock.withoutName,
        is_contract: true,
        is_verified: true,
        name: 'HomeBridge',
        implementations: [
          { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
        ],
      },
    },
    epoch_number: 1486,
    l1_era_finalized_epoch_number: 1485,
    is_epoch_block: false,
  },
};

export const withWithdrawals: schemas['BlockResponse'] = {
  ...base,
  withdrawals_count: 2,
};
