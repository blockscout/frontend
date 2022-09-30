/* eslint-disable max-len */
import { block } from './block';

export const blocks = [
  {
    ...block,
    timestamp: Date.now() - 25_000,
  },
  {
    ...block,
    height: 15006917,
    timestamp: Date.now() - 1_000 * 60 * 2,
    miner: {
      address: '0xdAd49e6CbDE849353ab27DeC6319E687BFc91A41',
      name: undefined,
    },
    transactionsNum: 185,
    size: 452,
    gas_limit: 30000000,
    gas_used: 15671326,
    gas_target: 14671326,
    burnt_fees: 0.3988042215537949,
  },
  {
    ...block,
    height: 15006916,
    timestamp: Date.now() - 1_000 * 60 * 60 * 17,
    transactionsNum: 377,
    size: 5222,
    gas_limit: 30000000,
    gas_used: 23856751,
    gas_target: 28856751,
    burnt_fees: 0.0000019660909367,
  },
];
