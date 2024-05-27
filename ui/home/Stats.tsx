import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { WEI } from 'lib/consts';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';

import StatsItem from './StatsItem';

const hasAvgBlockTime = config.UI.homepage.showAvgBlockTime;
const rollupFeature = config.features.rollup;

const Stats = () => {
  const [ hasGasTracker, setHasGasTracker ] = React.useState(config.features.gasTracker.isEnabled);
  const { data, isPlaceholderData, isError, dataUpdatedAt } = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  React.useEffect(() => {
    if (!isPlaceholderData && !data?.gas_prices?.average) {
      setHasGasTracker(false);
    }
  // should run only after initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const zkEvmLatestBatchQuery = useApiQuery('homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm',
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync',
    },
  });

  if (isError || zkEvmLatestBatchQuery.isError || zkSyncLatestBatchQuery.isError) {
    return null;
  }

  const isLoading = isPlaceholderData ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && zkEvmLatestBatchQuery.isPlaceholderData) ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && zkSyncLatestBatchQuery.isPlaceholderData);

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  let itemsCount = 5;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  if (data) {
    !data.gas_prices && itemsCount--;
    data.rootstock_locked_btc && itemsCount++;
    rollupFeature.isEnabled && data.last_output_root_size && itemsCount++;
    const isOdd = Boolean(itemsCount % 2);
    const gasInfoTooltip = hasGasTracker && data.gas_prices && data.gas_prices.average ? (
      <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt }>
        <IconSvg
          isLoading={ isLoading }
          name="info"
          boxSize={ 5 }
          display="block"
          cursor="pointer"
          _hover={{ color: 'link_hovered' }}
          position="absolute"
          top={{ base: 'calc(50% - 12px)', lg: '10px', xl: 'calc(50% - 12px)' }}
          right="10px"
        />
      </GasInfoTooltip>
    ) : null;

    content = (
      <>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && (
          <StatsItem
            icon="txn_batches"
            title="Latest batch"
            value={ (zkEvmLatestBatchQuery.data || 0).toLocaleString() }
            url={ route({ pathname: '/batches' }) }
            isLoading={ isLoading }
          />
        ) }
        { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && (
          <StatsItem
            icon="txn_batches"
            title="Latest batch"
            value={ (zkSyncLatestBatchQuery.data || 0).toLocaleString() }
            url={ route({ pathname: '/batches' }) }
            isLoading={ isLoading }
          />
        ) }
        { !(rollupFeature.isEnabled && (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync')) && (
          <StatsItem
            icon="block"
            title="Total blocks"
            value={ Number(data.total_blocks).toLocaleString() }
            url={ route({ pathname: '/blocks' }) }
            isLoading={ isLoading }
          />
        ) }
        { hasAvgBlockTime && (
          <StatsItem
            icon="clock-light"
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) }s` }
            isLoading={ isLoading }
          />
        ) }
        <StatsItem
          icon="transactions"
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          url={ route({ pathname: '/txs' }) }
          isLoading={ isLoading }
        />
        { rollupFeature.isEnabled && data.last_output_root_size && (
          <StatsItem
            icon="txn_batches"
            title="Latest L1 state batch"
            value={ data.last_output_root_size }
            url={ route({ pathname: '/batches' }) }
            isLoading={ isLoading }
          />
        ) }
        <StatsItem
          icon="wallet"
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ isOdd ? lastItemTouchStyle : undefined }
          isLoading={ isLoading }
        />
        { hasGasTracker && data.gas_prices && (
          <StatsItem
            icon="gas"
            title="Gas tracker"
            value={ data.gas_prices.average ? <GasPrice data={ data.gas_prices.average }/> : 'N/A' }
            _last={ isOdd ? lastItemTouchStyle : undefined }
            tooltip={ gasInfoTooltip }
            isLoading={ isLoading }
          />
        ) }
        { data.rootstock_locked_btc && (
          <StatsItem
            icon="coins/bitcoin"
            title="BTC Locked in 2WP"
            value={ `${ BigNumber(data.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC` }
            _last={ isOdd ? lastItemTouchStyle : undefined }
            isLoading={ isLoading }
          />
        ) }
      </>
    );
  }

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(${ itemsCount }, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap={{ base: 1, lg: 2 }}
      marginTop={ 3 }
    >
      { content }
    </Grid>

  );
};

export default Stats;
