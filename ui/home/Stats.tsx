import { Grid } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import clockIcon from 'icons/clock-light.svg';
import gasIcon from 'icons/gas.svg';
import txIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';

import StatsGasPrices from './StatsGasPrices';
import StatsItem from './StatsItem';

const hasGasTracker = appConfig.homepage.showGasTracker;
const hasAvgBlockTime = appConfig.homepage.showAvgBlockTime;

let itemsCount = 5;
!hasGasTracker && itemsCount--;
!hasAvgBlockTime && itemsCount--;

const Stats = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (isError) {
    return null;
  }

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  if (data) {
    const isOdd = Boolean(hasGasTracker && !data.gas_prices ? (itemsCount - 1) % 2 : itemsCount % 2);
    const gasLabel = hasGasTracker && data.gas_prices ? <StatsGasPrices gasPrices={ data.gas_prices }/> : null;

    content = (
      <>
        <StatsItem
          icon={ blockIcon }
          title="Total blocks"
          value={ Number(data.total_blocks).toLocaleString() }
          url={ route({ pathname: '/blocks' }) }
          isLoading={ isPlaceholderData }
        />
        { hasAvgBlockTime && (
          <StatsItem
            icon={ clockIcon }
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) } s` }
            isLoading={ isPlaceholderData }
          />
        ) }
        <StatsItem
          icon={ txIcon }
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          url={ route({ pathname: '/txs' }) }
          isLoading={ isPlaceholderData }
        />
        <StatsItem
          icon={ walletIcon }
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ isOdd ? lastItemTouchStyle : undefined }
          isLoading={ isPlaceholderData }
        />
        { hasGasTracker && data.gas_prices && (
          <StatsItem
            icon={ gasIcon }
            title="Gas tracker"
            value={ `${ Number(data.gas_prices.average).toLocaleString() } Gwei` }
            _last={ isOdd ? lastItemTouchStyle : undefined }
            tooltipLabel={ gasLabel }
            isLoading={ isPlaceholderData }
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
