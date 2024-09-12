import type { Block, BlockEpochElectionReward, BlockEpoch } from 'types/api/block';

import { ADDRESS_PARAMS } from './addressParams';
import { TOKEN_INFO_ERC_20, TOKEN_TRANSFER_ERC_20 } from './token';

export const BLOCK_HASH = '0x8fa7b9e5e5e79deeb62d608db22ba9a5cb45388c7ebb9223ae77331c6080dc70';

export const BLOCK: Block = {
  base_fee_per_gas: '14',
  burnt_fees: '92834504000000000',
  burnt_fees_percentage: 42.2,
  difficulty: '340282366920938463463374607431768211451',
  extra_data: 'TODO',
  gas_limit: '30000000',
  gas_target_percentage: 55.79,
  gas_used: '6631036',
  gas_used_percentage: 22.10,
  hash: BLOCK_HASH,
  height: 8988736,
  miner: ADDRESS_PARAMS,
  nonce: '0x0000000000000000',
  parent_hash: BLOCK_HASH,
  priority_fee: '19241635454943109',
  rewards: [
    {
      reward: '19241635454943109',
      type: 'Validator Reward',
    },
  ],
  size: 46406,
  state_root: 'TODO',
  timestamp: '2023-05-12T19:29:12.000000Z',
  total_difficulty: '10837812015930321201107455268036056402048391639',
  tx_count: 142,
  tx_fees: '19241635547777613',
  type: 'block',
  uncles_hashes: [],
};

const BLOCK_EPOCH_REWARD: BlockEpochElectionReward = {
  count: 10,
  total: '157705500305820107521',
  token: TOKEN_INFO_ERC_20,
};

export const BLOCK_EPOCH: BlockEpoch = {
  number: 1486,
  aggregated_election_rewards: {
    group: BLOCK_EPOCH_REWARD,
    validator: BLOCK_EPOCH_REWARD,
    voter: BLOCK_EPOCH_REWARD,
    delegated_payment: BLOCK_EPOCH_REWARD,
  },
  distribution: {
    carbon_offsetting_transfer: TOKEN_TRANSFER_ERC_20,
    community_transfer: TOKEN_TRANSFER_ERC_20,
    reserve_bolster_transfer: TOKEN_TRANSFER_ERC_20,
  },
};
