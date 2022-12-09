import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import clockIcon from 'icons/clock-light.svg';
import gasIcon from 'icons/gas.svg';
import txIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import useFetch from 'lib/hooks/useFetch';

import StatsGasPrices from './StatsGasPrices';
import StatsItem from './StatsItem';
import StatsItemSkeleton from './StatsItemSkeleton';

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

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  if (data) {
    const gasLabel = hasGasTracker ? <StatsGasPrices gasPrices={ data.gas_prices }/> : null;
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
          _last={ itemsCount % 2 ? lastItemTouchStyle : undefined }
        />
        { hasGasTracker && (
          <StatsItem
            icon={ gasIcon }
            title="Gas tracker"
            value={ `${ Number(data.gas_prices.average).toLocaleString() } Gwei` }
            _last={ itemsCount % 2 ? lastItemTouchStyle : undefined }
            tooltipLabel={ gasLabel }
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
