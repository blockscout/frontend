import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { WEI } from 'lib/consts';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';

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

  const lastItemStyle = { gridColumn: 'span 2' };

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
          flexShrink={ 0 }
          cursor="pointer"
          color="icon_info"
          _hover={{ color: 'link_hovered' }}
        />
      </GasInfoTooltip>
    ) : null;

    content = (
      <>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && (
          <StatsWidget
            icon="txn_batches_slim"
            label="Latest batch"
            value={ (zkEvmLatestBatchQuery.data || 0).toLocaleString() }
            href={{ pathname: '/batches' }}
            isLoading={ isLoading }
          />
        ) }
        { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && (
          <StatsWidget
            icon="txn_batches_slim"
            label="Latest batch"
            value={ (zkSyncLatestBatchQuery.data || 0).toLocaleString() }
            href={{ pathname: '/batches' }}
            isLoading={ isLoading }
          />
        ) }
        { !(rollupFeature.isEnabled && (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync')) && (
          <StatsWidget
            icon="block_slim"
            label="Total blocks"
            value={ Number(data.total_blocks).toLocaleString() }
            href={{ pathname: '/blocks' }}
            isLoading={ isLoading }
          />
        ) }
        { hasAvgBlockTime && (
          <StatsWidget
            icon="clock"
            label="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) }s` }
            isLoading={ isLoading }
          />
        ) }
        <StatsWidget
          icon="transactions_slim"
          label="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          href={{ pathname: '/txs' }}
          isLoading={ isLoading }
        />
        { rollupFeature.isEnabled && data.last_output_root_size && (
          <StatsWidget
            icon="txn_batches_slim"
            label="Latest L1 state batch"
            value={ data.last_output_root_size }
            href={{ pathname: '/batches' }}
            isLoading={ isLoading }
          />
        ) }
        <StatsWidget
          icon="wallet"
          label="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          isLoading={ isLoading }
          _last={ isOdd ? lastItemStyle : undefined }
        />
        { hasGasTracker && data.gas_prices && (
          <StatsWidget
            icon="gas"
            label="Gas tracker"
            value={ data.gas_prices.average ? <GasPrice data={ data.gas_prices.average }/> : 'N/A' }
            hint={ gasInfoTooltip }
            isLoading={ isLoading }
            _last={ isOdd ? lastItemStyle : undefined }
          />
        ) }
        { data.rootstock_locked_btc && (
          <StatsWidget
            icon="coins/bitcoin"
            label="BTC Locked in 2WP"
            value={ `${ BigNumber(data.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC` }
            isLoading={ isLoading }
            _last={ isOdd ? lastItemStyle : undefined }
          />
        ) }
      </>
    );
  }

  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { content }
    </Grid>

  );
};

export default Stats;
