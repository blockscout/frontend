import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import gasIcon from 'icons/gas.svg';
import useFetch from 'lib/hooks/useFetch';

import StatsBlockTime from './stats/StatsBlockTime';
import StatsItem from './stats/StatsItem';
import StatsItemSkeleton from './stats/StatsItemSkeleton';
import StatsTotalBlocks from './stats/StatsTotalBlocks';
import StatsTotalTxs from './stats/StatsTotalTxs';
import StatsWalletAddresses from './stats/StatsWalletAddresses';

const hasGasTracker = appConfig.homepage.showGasTracker;
const hasAvgBlockTime = appConfig.homepage.showAvgBlockTime;

let itemsCount = 5;
!hasGasTracker && itemsCount--;
!hasAvgBlockTime && itemsCount--;

const Stats = () => {
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, HomeStats>(
    [ QueryKeys.homeStats ],
    async() => await fetch(`/node-api/stats`),
  );

  if (isError) {
    return null;
  }

  let content;

  if (isLoading) {
    content = Array.from(Array(itemsCount)).map((item, index) => <StatsItemSkeleton key={ index }/>);
  }

  if (data) {
    content = (
      <>
        <StatsTotalBlocks value={ data.total_blocks }/>
        { hasAvgBlockTime && <StatsBlockTime value={ data.average_block_time }/> }
        <StatsTotalTxs value={ data.total_transactions }/>
        <StatsWalletAddresses value={ data.total_addresses }/>
        { hasGasTracker && (
          <StatsItem
            icon={ gasIcon }
            title="Gas tracker"
            value={ `${ Number(data.gas_prices.average).toLocaleString() } Gwei` }
          />
        ) }
      </>
    );
  }

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(${ itemsCount }, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { content }
    </Grid>

  );
};

export default Stats;
