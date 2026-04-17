import { Grid } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { layerLabels } from 'lib/rollups/utils';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { WEI } from 'ui/shared/value/utils';

import StatsDegraded from './fallbacks/StatsDegraded';
import type { HomeStatsItem } from './utils';
import { isHomeStatsItemEnabled, sortHomeStatsItems } from './utils';

const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';
const isStatsFeatureEnabled = config.features.stats.isEnabled;

type LatestBatchSocketEventMessage = SocketMessage.NewArbitrumL2Batch | SocketMessage.NewZkEvmL2Batch;
type LatestBatchPayload = Parameters<LatestBatchSocketEventMessage['handler']>[0];
type LatestBatchHandler = LatestBatchSocketEventMessage['handler'];
type LatestBatchSocketMessage = LatestBatchSocketEventMessage | SocketMessage.Unknown;

const Stats = () => {
  const [ hasGasTracker, setHasGasTracker ] = React.useState(config.features.gasTracker.isEnabled);
  const queryClient = useQueryClient();

  // data from stats microservice is prioritized over data from stats api
  const statsQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
    },
  });

  const apiQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const blocksQuery = useApiQuery('general:homepage_blocks', {
    queryOptions: {
      placeholderData: [ BLOCK ],
    },
  });

  const isPlaceholderData = statsQuery.isPlaceholderData || apiQuery.isPlaceholderData || blocksQuery.isPlaceholderData;

  React.useEffect(() => {
    if (!isPlaceholderData && !apiQuery.data?.gas_prices?.average) {
      setHasGasTracker(false);
    }
  // should run only after initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const zkEvmLatestBatchQuery = useApiQuery('general:homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('general:homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const arbitrumLatestBatchQuery = useApiQuery('general:homepage_arbitrum_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const [ latestBatchQuery, latestBatchSocketConfig ] = (() => {
    if (!rollupFeature.isEnabled || !config.UI.homepage.stats.includes('latest_batch')) {
      return [ undefined, undefined ] as const;
    }

    switch (rollupFeature.type) {
      case 'zkEvm':
        return [
          zkEvmLatestBatchQuery,
          {
            topic: 'zkevm_batches:new_zkevm_confirmed_batch',
            event: 'new_zkevm_confirmed_batch',
            resource: 'general:homepage_zkevm_latest_batch',
          },
        ] as const;
      case 'zkSync':
        return [ zkSyncLatestBatchQuery, undefined ] as const;
      case 'arbitrum':
        return [
          arbitrumLatestBatchQuery,
          {
            topic: 'arbitrum:new_batch',
            event: 'new_arbitrum_batch',
            resource: 'general:homepage_arbitrum_latest_batch',
          },
        ] as const;
      default:
        return [ undefined, undefined ] as const;
    }
  })();

  const hasStatsError = apiQuery.isError || statsQuery.isError || blocksQuery.isError || Boolean(latestBatchQuery?.isError);

  const blocksSocketDisabled = isPlaceholderData || hasStatsError;
  const latestBatchSocketDisabled =
    !latestBatchSocketConfig ||
    latestBatchQuery?.isError ||
    latestBatchQuery?.isPlaceholderData ||
    latestBatchQuery?.data === undefined;

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('general:homepage_blocks'), (prevData: Array<Block> | undefined) => {
      const newData = prevData ? [ ...prevData ] : [];
      if (newData.some((block) => block.height === payload.block.height)) {
        return newData;
      }
      const maxCount = newData.length || 1;
      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, maxCount);
    });
  }, [ queryClient ]);

  const handleNewLatestBatchMessage = React.useCallback((payload: LatestBatchPayload) => {
    if (!latestBatchSocketConfig) {
      return;
    }
    queryClient.setQueryData(getResourceKey(latestBatchSocketConfig.resource), (prev: number | undefined) => {
      const nextBatchNumber = payload.batch.number;
      if (prev === undefined) {
        return nextBatchNumber;
      }
      return Math.max(prev, nextBatchNumber);
    });
  }, [ queryClient, latestBatchSocketConfig ]);

  const blocksChannel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: blocksSocketDisabled,
  });
  useSocketMessage({
    channel: blocksChannel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const latestBatchChannel = useSocketChannel({
    topic: latestBatchSocketConfig?.topic,
    isDisabled: Boolean(latestBatchSocketDisabled),
  });
  useSocketMessage({
    channel: latestBatchChannel,
    event: latestBatchSocketConfig?.event,
    handler: handleNewLatestBatchMessage as LatestBatchHandler,
  } as LatestBatchSocketMessage);

  if (hasStatsError) {
    return <StatsDegraded/>;
  }

  const isLoading = isPlaceholderData || latestBatchQuery?.isPlaceholderData;

  const apiData = apiQuery.data;
  const statsData = statsQuery.data;

  const items: Array<HomeStatsItem> = (() => {
    if (!statsData && !apiData) {
      return [];
    }

    const gasInfoTooltip = hasGasTracker && apiData?.gas_prices && apiData.gas_prices.average ? (
      <GasInfoTooltip data={ apiData } dataUpdatedAt={ apiQuery.dataUpdatedAt }>
        <IconSvg
          isLoading={ isLoading }
          name="info"
          boxSize={ 5 }
          flexShrink={ 0 }
          cursor="pointer"
          color="icon.secondary"
          _hover={{ color: 'hover' }}
        />
      </GasInfoTooltip>
    ) : null;

    return [
      latestBatchQuery?.data !== undefined && {
        id: 'latest_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest batch',
        value: latestBatchQuery.data.toLocaleString(),
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (blocksQuery.data?.[0]?.height || statsData?.total_blocks?.value || apiData?.total_blocks) && {
        id: 'total_blocks' as const,
        icon: 'block' as const,
        label: 'Latest block',
        value: Number(blocksQuery.data?.[0]?.height || statsData?.total_blocks?.value || apiData?.total_blocks).toLocaleString(),
        href: { pathname: '/blocks' as const },
        isLoading,
      },
      (statsData?.average_block_time?.value || apiData?.average_block_time) && {
        id: 'average_block_time' as const,
        icon: 'clock-light' as const,
        label: statsData?.average_block_time?.title || 'Average block time',
        value: `${
          statsData?.average_block_time?.value ?
            Number(statsData.average_block_time.value).toFixed(1) :
            (apiData!.average_block_time / 1000).toFixed(1)
        }s`,
        isLoading,
      },
      (statsData?.total_transactions?.value || apiData?.total_transactions) && {
        id: 'total_txs' as const,
        icon: 'transactions' as const,
        label: statsData?.total_transactions?.title || 'Total transactions',
        value: Number(statsData?.total_transactions?.value || apiData?.total_transactions).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isArbitrumRollup && statsData?.total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: statsData?.total_operational_transactions?.title || 'Total operational transactions',
        value: Number(statsData?.total_operational_transactions?.value).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isOptimisticRollup && statsData?.op_stack_total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: statsData?.op_stack_total_operational_transactions?.title || 'Total operational transactions',
        value: Number(statsData?.op_stack_total_operational_transactions?.value).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      apiData?.last_output_root_size && {
        id: 'latest_l1_state_batch' as const,
        icon: 'txn_batches' as const,
        label: `Latest ${ layerLabels.parent } state batch`,
        value: apiData?.last_output_root_size,
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (statsData?.total_addresses?.value || apiData?.total_addresses) && {
        id: 'wallet_addresses' as const,
        icon: 'wallet' as const,
        label: statsData?.total_addresses?.title || 'Wallet addresses',
        value: Number(statsData?.total_addresses?.value || apiData?.total_addresses).toLocaleString(),
        isLoading,
      },
      hasGasTracker && apiData?.gas_prices && {
        id: 'gas_tracker' as const,
        icon: 'gas' as const,
        label: 'Gas tracker',
        value: apiData.gas_prices.average ? <GasPrice data={ apiData.gas_prices.average }/> : 'N/A',
        hint: gasInfoTooltip,
        isLoading,
      },
      apiData?.rootstock_locked_btc && {
        id: 'btc_locked' as const,
        icon: 'coins/bitcoin' as const,
        label: 'BTC Locked in 2WP',
        value: `${ BigNumber(apiData.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC`,
        isLoading,
      },
      apiData?.celo && {
        id: 'current_epoch' as const,
        icon: 'hourglass' as const,
        label: 'Current epoch',
        value: `#${ apiData.celo.epoch_number }`,
        href: { pathname: '/epochs/[number]' as const, query: { number: String(apiData.celo.epoch_number) } },
        isLoading,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  })();

  if (items.length === 0) {
    return null;
  }

  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { items.map((item, index) => (
        <StatsWidget
          key={ item.id }
          { ...item }
          isLoading={ isLoading }
          _last={ items.length % 2 === 1 && index === items.length - 1 ? { gridColumn: 'span 2' } : undefined }/>
      ),
      ) }
    </Grid>

  );
};

export default Stats;
