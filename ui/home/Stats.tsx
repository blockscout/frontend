import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { WEI } from 'lib/consts';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltipContent from 'ui/shared/GasInfoTooltipContent/GasInfoTooltipContent';

import StatsItem from './StatsItem';

const hasGasTracker = config.UI.homepage.showGasTracker;
const hasAvgBlockTime = config.UI.homepage.showAvgBlockTime;

const Stats = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const zkEvmLatestBatchQuery = useApiQuery('homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: config.features.zkEvmRollup.isEnabled,
    },
  });

  if (isError || zkEvmLatestBatchQuery.isError) {
    return null;
  }

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  let itemsCount = 5;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  if (data) {
    !data.gas_prices && itemsCount--;
    data.rootstock_locked_btc && itemsCount++;
    const isOdd = Boolean(itemsCount % 2);
    const gasLabel = hasGasTracker && data.gas_prices ? <GasInfoTooltipContent gasPrices={ data.gas_prices }/> : null;

    content = (
      <>
        { config.features.zkEvmRollup.isEnabled ? (
          <StatsItem
            icon="txn_batches"
            title="Latest batch"
            value={ (zkEvmLatestBatchQuery.data || 0).toLocaleString() }
            url={ route({ pathname: '/zkevm-l2-txn-batches' }) }
            isLoading={ zkEvmLatestBatchQuery.isPlaceholderData }
          />
        ) : (
          <StatsItem
            icon="block"
            title="Total blocks"
            value={ Number(data.total_blocks).toLocaleString() }
            url={ route({ pathname: '/blocks' }) }
            isLoading={ isPlaceholderData }
          />
        ) }
        { hasAvgBlockTime && (
          <StatsItem
            icon="clock-light"
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) }s` }
            isLoading={ isPlaceholderData }
          />
        ) }
        <StatsItem
          icon="transactions"
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          url={ route({ pathname: '/txs' }) }
          isLoading={ isPlaceholderData }
        />
        <StatsItem
          icon="wallet"
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ isOdd ? lastItemTouchStyle : undefined }
          isLoading={ isPlaceholderData }
        />
        { hasGasTracker && data.gas_prices && (
          <StatsItem
            icon="gas"
            title="Gas tracker"
            value={ data.gas_prices.average !== null ? `${ Number(data.gas_prices.average).toLocaleString() } Gwei` : 'N/A' }
            _last={ isOdd ? lastItemTouchStyle : undefined }
            tooltipLabel={ gasLabel }
            isLoading={ isPlaceholderData }
          />
        ) }
        { data.rootstock_locked_btc && (
          <StatsItem
            icon="coins/bitcoin"
            title="BTC Locked in 2WP"
            value={ `${ BigNumber(data.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC` }
            _last={ isOdd ? lastItemTouchStyle : undefined }
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
