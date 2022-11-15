import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { Stats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import clockIcon from 'icons/clock-light.svg';
import gasIcon from 'icons/gas.svg';
import txIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import useFetch from 'lib/hooks/useFetch';

import StatsItem from './StatsItem';
import StatsItemSkeleton from './StatsItemSkeleton';

const Stats = () => {
  const fetch = useFetch();

  const hasGasTracker = appConfig.stats.showGasTracker;
  const hasAvgBlockTime = appConfig.stats.showAvgBlockTime;

  let itemsCount = 5;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  const { data, isLoading, isError } = useQuery<unknown, unknown, Stats>(
    [ QueryKeys.stats ],
    async() => await fetch(`/api/index/stats`),
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
        <StatsItem
          icon={ blockIcon }
          title="Total blocks"
          value={ Number(data.total_blocks).toLocaleString() }
        />
        { hasAvgBlockTime && (
          <StatsItem
            icon={ clockIcon }
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) } s` }
          />
        ) }
        <StatsItem
          icon={ txIcon }
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
        />
        <StatsItem
          icon={ walletIcon }
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
        />
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
      gridTemplateColumns={{ lg: `repeat(${ itemsCount }, 1fr)`, base: 'none' }}
      gridTemplateRows={{ lg: 'none', base: `repeat(${ itemsCount }, 1fr)` }}
      gridGap="10px"
      marginTop="32px"
    >
      { content }
    </Grid>

  );
};

export default Stats;
