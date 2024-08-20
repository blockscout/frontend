import React from 'react';

import type { BlockEpoch } from 'types/api/block';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  type: keyof BlockEpoch['aggregated_election_rewards'];
}

const BlockEpochElectionRewardsType = ({ type }: Props) => {
  switch (type) {
    case 'delegated_payment':
      return <Tag colorScheme="blue">Delegated payments</Tag>;
    case 'group':
      return <Tag colorScheme="teal">Validator group rewards</Tag>;
    case 'validator':
      return <Tag colorScheme="purple">Validator rewards</Tag>;
    case 'voter':
      return <Tag colorScheme="yellow">Voting rewards</Tag>;
  }
};

export default React.memo(BlockEpochElectionRewardsType);
