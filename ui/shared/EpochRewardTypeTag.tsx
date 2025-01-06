import { Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { EpochRewardsType } from 'types/api/block';

import Tag from 'ui/shared/chakra/Tag';

type Props = {
  type: EpochRewardsType;
  isLoading?: boolean;
};

const TYPE_TAGS: Record<EpochRewardsType, { text: string; label: string; color: string }> = {
  group: {
    text: 'Validator group rewards',
    // eslint-disable-next-line max-len
    label: 'Reward given to a validator group. The address being viewed is the group\'s address; the associated address is the validator\'s address on whose behalf the reward was paid.',
    color: 'teal',
  },
  validator: {
    text: 'Validator rewards',
    label: 'Reward given to a validator. The address being viewed is the validator\'s address; the associated address is the validator group\'s address.',
    color: 'purple',
  },
  delegated_payment: {
    text: 'Delegated payments',
    // eslint-disable-next-line max-len
    label: 'Reward portion delegated by a validator to another address. The address being viewed is the beneficiary receiving the reward; the associated address is the validator who set the delegation.',
    color: 'blue',
  },
  voter: {
    text: 'Voting rewards',
    label: 'Reward given to a voter. The address being viewed is the voter\'s address; the associated address is the group address.',
    color: 'yellow',
  },
};

const EpochRewardTypeTag = ({ type, isLoading }: Props) => {
  const { text, label, color } = TYPE_TAGS[type];

  return (
    <Tooltip label={ label } maxW="322px" textAlign="center">
      <Tag colorScheme={ color } isLoading={ isLoading }>
        { text }
      </Tag>
    </Tooltip>
  );
};

export default React.memo(EpochRewardTypeTag);
