/* eslint-disable max-len */
import type { Block, BlocksResponse } from 'types/api/block';

export const base: Block = {
  base_fee_per_gas: '10000000000',
  burnt_fees: '5449200000000000',
  burnt_fees_percentage: 20.292245650793845,
  difficulty: '340282366920938463463374607431768211454',
  extra_data: 'TODO',
  gas_limit: '12500000',
  gas_target_percentage: -91.28128,
  gas_used: '544920',
  gas_used_percentage: 4.35936,
  hash: '0xccc75136de485434d578b73df66537c06b34c3c9b12d085daf95890c914fc2bc',
  height: 30146364,
  miner: {
    hash: '0xdAd49e6CbDE849353ab27DeC6319E687BFc91A41',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: 'Alex Emelyanov',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
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
  state_root: 'TODO',
  timestamp: '2022-11-11T11:59:35Z',
  total_difficulty: '10258276095980170141167591583995189665817672619',
  tx_count: 5,
  tx_fees: '26853607500000000',
  type: 'block',
  uncles_hashes: [],
};

export const genesis: Block = {
  base_fee_per_gas: null,
  burnt_fees: null,
  burnt_fees_percentage: null,
  difficulty: '131072',
  extra_data: 'TODO',
  gas_limit: '6700000',
  gas_target_percentage: -100,
  gas_used: '0',
  gas_used_percentage: 0,
  hash: '0x39f02c003dde5b073b3f6e1700fc0b84b4877f6839bb23edadd3d2d82a488634',
  height: 0,
  miner: {
    hash: '0x0000000000000000000000000000000000000000',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: 'kitty.kitty.cat.eth',
  },
  nonce: '0x0000000000000000',
  parent_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  priority_fee: null,
  rewards: [],
  size: 533,
  state_root: 'TODO',
  timestamp: '2017-12-16T00:13:24.000000Z',
  total_difficulty: '131072',
  tx_count: 0,
  tx_fees: '0',
  type: 'block',
  uncles_hashes: [],
};

export const base2: Block = {
  ...base,
  height: base.height - 1,
  size: 592,
  miner: {
    hash: '0xDfE10D55d9248B2ED66f1647df0b0A46dEb25165',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: 'Kiryl Ihnatsyeu',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
  },
  timestamp: '2022-11-11T11:46:05Z',
  tx_count: 253,
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
};

export const rootstock: Block = {
  ...base,
  bitcoin_merged_mining_coinbase_transaction: '0x0000000000000080a1219cea298d65d545b56abafe7c5421edfaf084cf9e374bb23ea985ebd86b206088ac0000000000000000266a24aa21a9edb2ac3022ad2a5327449f029b6aa3d2e55605061b5d8171b30abf5b330d1959c900000000000000002a6a52534b424c4f434b3a481d071e57c6c47cb8eb716295a7079b15859962abf35e32f107b21f003f0bb900000000',
  bitcoin_merged_mining_header: '0x000000204a7e42cadf8b5b0a094755c5a13298e596d61f361c6d31171a00000000000000970e51977cd6f82bab9ed62e678c8d8ca664af9d5c3b5cea39d5d4337c7abedae334c9649fc63e1982a84aaa',
  bitcoin_merged_mining_merkle_proof: '0x09f386e5e6feb20706a1b5d0817eae96f0ebb0d713eeefe6d5625afc6fd87fcdfe8cc9118bb49e32db87f8e928dcb13dd327b526ced76fb9de0115a5dca8d2a9657c929360ad07418fc7e1a3120da27e0002470d0c98c9b8b5b2835e64e379421d2469204533307bf0c5a087d93fd1dfb3aaea3ee83099928860f6cca891cf59d73c4e3c6053ea4b385dce39067e87c28805ddd89c4ff10500401bec7c248f749ad6f0933e6ad270e447d01711aca1cc26d7989ee59e1431fd2fd5d058edca6d',
  hash_for_merged_mining: '0x481d071e57c6c47cb8eb716295a7079b15859962abf35e32f107b21f003f0bb9',
  minimum_gas_price: '59240000',
};

export const baseListResponse: BlocksResponse = {
  items: [
    base,
    base2,
  ],
  next_page_params: null,
};
