// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type getBlockReward from 'src/slices/block/utils/get-block-reward';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import { WEI } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { ZERO } from 'src/toolkit/utils/consts';
import { space } from 'src/toolkit/utils/htmlEntities';

const rollupFeature = config.features.rollup;

interface Props {
  reward: ReturnType<typeof getBlockReward>;
  validatorTitle: string;
  isLoading: boolean;
}

const BlockDetailsRewardBreakdown = ({ reward, isLoading }: Pick<Props, 'reward' | 'isLoading'>) => {
  const { staticReward, txFees, burntFees } = reward;

  if (txFees.isEqualTo(ZERO) || burntFees.isEqualTo(ZERO)) {
    return null;
  }

  if (isLoading) {
    return <Skeleton loading w="525px" h="20px"/>;
  }

  return (
    <Text color="text.secondary" whiteSpace="break-spaces">
      <Tooltip content="Static block reward">
        <span>{ staticReward.dividedBy(WEI).toFixed() }</span>
      </Tooltip>
      { space }+{ space }
      <Tooltip content="Txn fees">
        <span>{ txFees.dividedBy(WEI).toFixed() }</span>
      </Tooltip>
      { space }-{ space }
      <Tooltip content="Burnt fees">
        <span>{ burntFees.dividedBy(WEI).toFixed() }</span>
      </Tooltip>
    </Text>
  );
};

const BlockDetailsReward = ({ reward, validatorTitle, isLoading }: Props) => {
  if (rollupFeature.isEnabled || reward.totalReward.isEqualTo(ZERO) || config.slices.block.hiddenFields?.total_reward) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={
          `For each block, the ${ validatorTitle } is rewarded with a finite amount of ${ config.chain.currency.symbol || 'native token' }
          on top of the fees paid for all transactions in the block`
        }
        isLoading={ isLoading }
      >
        Block reward
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 1 } multiRow>
        <NativeCoinValue amount={ reward.totalReward.toString() } accuracy={ 0 } loading={ isLoading }/>
        <BlockDetailsRewardBreakdown reward={ reward } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsReward);
