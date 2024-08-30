import React from 'react';

import type { BlockEpoch } from 'types/api/block';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  type: keyof BlockEpoch['aggregated_election_rewards'];
  isLoading?: boolean;
}

const BlockEpochElectionRewardType = ({ type, isLoading }: Props) => {
  switch (type) {
    case 'delegated_payment':
      return <Tag colorScheme="blue" isLoading={ isLoading }>Delegated payments</Tag>;
    case 'group':
      return <Tag colorScheme="teal" isLoading={ isLoading }>Validator group rewards</Tag>;
    case 'validator':
      return <Tag colorScheme="purple" isLoading={ isLoading }>Validator rewards</Tag>;
    case 'voter':
      return <Tag colorScheme="yellow" isLoading={ isLoading }>Voting rewards</Tag>;
  }
};

export default React.memo(BlockEpochElectionRewardType);
