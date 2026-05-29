// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { Block } from 'src/slices/block/types/api';

import { WEI } from 'src/shared/values/entity/utils';

import { ZERO } from 'src/toolkit/utils/consts';

export default function getBlockTotalReward(block: Block) {
  const totalReward = block.rewards
    ?.map(({ reward }) => BigNumber(reward))
    .reduce((result, item) => result.plus(item), ZERO) || ZERO;

  return totalReward.div(WEI);
}
