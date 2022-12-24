import BigNumber from 'bignumber.js';

import type { Block } from 'types/api/block';

import { WEI, ZERO } from 'lib/consts';

export default function getBlockTotalReward(block: Block) {
  const totalReward = block.rewards
    ?.map(({ reward }) => BigNumber(reward))
    .reduce((result, item) => result.plus(item), ZERO) || ZERO;

  return totalReward.div(WEI);
}
