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
import type { Props as StatsWidgetProps } from 'ui/shared/stats/StatsWidget';
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

  const arbitrumLatestBatchQuery = useApiQuery('homepage_arbitrum_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'arbitrum',
    },
  });

  if (isError || zkEvmLatestBatchQuery.isError || zkSyncLatestBatchQuery.isError || arbitrumLatestBatchQuery.isError) {
    return null;
  }

  const isLoading = isPlaceholderData ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && zkEvmLatestBatchQuery.isPlaceholderData) ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && zkSyncLatestBatchQuery.isPlaceholderData) ||
    (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && arbitrumLatestBatchQuery.isPlaceholderData);

  const content = (() => {
    if (!data) {
      return null;
    }
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

    const hasBatches = rollupFeature.isEnabled && (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync' || rollupFeature.type === 'arbitrum');
    const latestBatch =
      (hasBatches && rollupFeature.type === 'zkEvm' ? zkEvmLatestBatchQuery.data : null) ||
      (hasBatches && rollupFeature.type === 'zkSync' ? zkSyncLatestBatchQuery.data : null) ||
      (hasBatches && rollupFeature.type === 'arbitrum' ? arbitrumLatestBatchQuery.data : null) || 0;

    const items: Array<StatsWidgetProps> = [
      hasBatches && {
        icon: 'txn_batches_slim' as const,
        label: 'Latest batch',
        value: latestBatch.toLocaleString(),
        href: { pathname: '/batches' as const },
        isLoading,
      },
      !hasBatches && {
        icon: 'block_slim' as const,
        label: 'Total blocks',
        value: Number(data.total_blocks).toLocaleString(),
        href: { pathname: '/blocks' as const },
        isLoading,
      },
      hasAvgBlockTime && {
        icon: 'clock-light' as const,
        label: 'Average block time',
        value: `${ (data.average_block_time / 1000).toFixed(1) }s`,
        isLoading,
      },
      {
        icon: 'transactions_slim' as const,
        label: 'Total transactions',
        value: Number(data.total_transactions).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      rollupFeature.isEnabled && data.last_output_root_size && {
        icon: 'txn_batches_slim' as const,
        label: 'Latest L1 state batch',
        value: data.last_output_root_size,
        href: { pathname: '/batches' as const },
        isLoading,
      },
      {
        icon: 'wallet' as const,
        label: 'Wallet addresses',
        value: Number(data.total_addresses).toLocaleString(),
        isLoading,
      },
      hasGasTracker && data.gas_prices && {
        icon: 'gas' as const,
        label: 'Gas tracker',
        value: data.gas_prices.average ? <GasPrice data={ data.gas_prices.average }/> : 'N/A',
        hint: gasInfoTooltip,
        isLoading,
      },
      data.rootstock_locked_btc && {
        icon: 'coins/bitcoin' as const,
        label: 'BTC Locked in 2WP',
        value: `${ BigNumber(data.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC`,
        isLoading,
      },
    ].filter(Boolean);

    return (
      <>
        { items.map((item, index) => (
          <StatsWidget
            key={ item.icon }
            { ...item }
            isLoading={ isLoading }
            _last={ items.length % 2 === 1 && index === items.length - 1 ? { gridColumn: 'span 2' } : undefined }/>
        ),
        ) }
      </>
    );
  })();

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
