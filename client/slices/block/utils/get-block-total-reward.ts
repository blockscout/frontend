// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { Block } from 'client/slices/block/types/api';

import { WEI } from 'client/shared/values/entity/utils';

import { ZERO } from 'toolkit/utils/consts';

export default function getBlockTotalReward(block: Block) {
  const totalReward = block.rewards
    ?.map(({ reward }) => BigNumber(reward))
    .reduce((result, item) => result.plus(item), ZERO) || ZERO;

  return totalReward.div(WEI);
}
