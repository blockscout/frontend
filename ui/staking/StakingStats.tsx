import { Grid } from '@chakra-ui/react';
import React from 'react';

import StatsItem from '../home/StatsItem';

const StakingStats = () => {
  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(4, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      <StatsItem
        icon="txn_batches"
        title="Average Reward Rate"
        value="17.43%"
        tooltipLabel="Estimated annual return of staking rewards."
      />
      <StatsItem
        icon="block"
        title="KSM Supply Staked"
        value="52.99%"
        tooltipLabel="Cumulative supply of DOT being staked globally relative to the total supply of DOT."
      />
      <StatsItem
        icon="clock-light"
        title="Time Remaining This Era"
        value="55 mins"
        tooltipLabel="At the end of each era, validators are rewarded DOT based on era points accumulated.  1 era is currently 24 hours in Polkadot."
      />
    </Grid>
  );
};

export default StakingStats;
