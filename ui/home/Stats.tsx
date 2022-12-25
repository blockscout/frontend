import { Grid } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import clockIcon from 'icons/clock-light.svg';
import gasIcon from 'icons/gas.svg';
import txIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import useApiQuery from 'lib/api/useApiQuery';
import link from 'lib/link/link';

import StatsGasPrices from './StatsGasPrices';
import StatsItem from './StatsItem';
import StatsItemSkeleton from './StatsItemSkeleton';

const hasGasTracker = appConfig.homepage.showGasTracker;
const hasAvgBlockTime = appConfig.homepage.showAvgBlockTime;

let itemsCount = 5;
!hasGasTracker && itemsCount--;
!hasAvgBlockTime && itemsCount--;

const Stats = () => {
  const { data, isLoading, isError } = useApiQuery('homepage_stats');

  if (isError) {
    return null;
  }

  let content;

  if (isLoading) {
    content = Array.from(Array(itemsCount)).map((item, index) => <StatsItemSkeleton key={ index }/>);
  }

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  if (data) {
    const gasLabel = hasGasTracker && data.gas_prices ? <StatsGasPrices gasPrices={ data.gas_prices }/> : null;
    content = (
      <>
        <StatsItem
          icon={ blockIcon }
          title="Total blocks"
          value={ Number(data.total_blocks).toLocaleString() }
          url={ link('blocks') }
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
          url={ link('txs') }
        />
        <StatsItem
          icon={ walletIcon }
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ itemsCount % 2 ? lastItemTouchStyle : undefined }
        />
        { hasGasTracker && data.gas_prices && (
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
