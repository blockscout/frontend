// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';

import { WEI } from 'src/shared/values/entity/utils';

import { ZERO } from 'src/toolkit/utils/consts';

export default function getBlockTotalReward(block: schemas['Block']) {
  const totalReward = block.rewards
    ?.map(({ reward }) => BigNumber(reward))
    .reduce((result, item) => result.plus(item), ZERO) || ZERO;

  return totalReward.div(WEI);
}
