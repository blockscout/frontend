import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import config from 'configs/app';
import type { ResourceError, ResourcePayload } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';

/** Max blocks kept in React Query cache for `general:homepage_blocks` (fetch + socket). */
export const HOME_BLOCKS_QUERY_LIMIT = 5;

const shouldShowLatestBlocks = (() => {
  const rollupFeature = config.features.rollup;
  const isLatestBlocksReplacedByBatches = rollupFeature.isEnabled &&
    !rollupFeature.homepage.showLatestBlocks &&
    [ 'zkEvm', 'arbitrum' ].includes(rollupFeature.type);

  return !isLatestBlocksReplacedByBatches;
})();

const shouldShowLatestBlockStat = config.UI.homepage.stats.includes('total_blocks');
const shouldShowLatestBatchStat = config.UI.homepage.stats.includes('latest_batch');

const isHomepageBlocksDataEnabled = shouldShowLatestBlocks || shouldShowLatestBlockStat;

type HomeBlocksQueryResult = UseQueryResult<
  ResourcePayload<'general:homepage_blocks'>,
  ResourceError<unknown>
>;

type HomeLatestBatchQueryResult = UseQueryResult<number, ResourceError<unknown>>;
type LatestBatchSocketEventMessage = SocketMessage.NewArbitrumL2Batch | SocketMessage.NewZkEvmL2Batch;
type LatestBatchPayload = Parameters<LatestBatchSocketEventMessage['handler']>[0];
type LatestBatchHandler = LatestBatchSocketEventMessage['handler'];
type LatestBatchSocketMessage = LatestBatchSocketEventMessage | SocketMessage.Unknown;

type HomeDataContextValue = {
  blocksQuery: HomeBlocksQueryResult;
  latestBatchQuery: HomeLatestBatchQueryResult | undefined;
};

const HomeDataContext = React.createContext<HomeDataContextValue | null>(null);

function useHomeBlocksData(): HomeBlocksQueryResult {
  const queryClient = useQueryClient();

  const blocksQuery = useApiQuery('general:homepage_blocks', {
    queryOptions: {
      enabled: isHomepageBlocksDataEnabled,
      placeholderData: Array(HOME_BLOCKS_QUERY_LIMIT).fill(BLOCK),
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('general:homepage_blocks'), (prevData: Array<Block> | undefined) => {
      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block) => block.height === payload.block.height)) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, HOME_BLOCKS_QUERY_LIMIT);
    });
  }, [ queryClient ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: !isHomepageBlocksDataEnabled || blocksQuery.isPlaceholderData || blocksQuery.isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  return blocksQuery;
}

function useHomeLatestBatchData(): HomeLatestBatchQueryResult | undefined {
  const queryClient = useQueryClient();
  const rollupFeature = config.features.rollup;

  const zkEvmLatestBatchQuery = useApiQuery('general:homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && shouldShowLatestBatchStat,
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('general:homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && shouldShowLatestBatchStat,
    },
  });

  const arbitrumLatestBatchQuery = useApiQuery('general:homepage_arbitrum_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && shouldShowLatestBatchStat,
    },
  });

  const [ latestBatchQuery, latestBatchSocketConfig ] = (() => {
    if (!rollupFeature.isEnabled || !shouldShowLatestBatchStat) {
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

  const latestBatchSocketDisabled =
    !latestBatchSocketConfig ||
    latestBatchQuery?.isError ||
    latestBatchQuery?.isPlaceholderData ||
    latestBatchQuery?.data === undefined;

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

  const latestBatchChannel = useSocketChannel({
    topic: latestBatchSocketConfig?.topic,
    isDisabled: Boolean(latestBatchSocketDisabled),
  });
  useSocketMessage({
    channel: latestBatchChannel,
    event: latestBatchSocketConfig?.event,
    handler: handleNewLatestBatchMessage as LatestBatchHandler,
  } as LatestBatchSocketMessage);

  return latestBatchQuery;
}

export function HomeDataContextProvider({ children }: { children: React.ReactNode }) {
  const blocksQuery = useHomeBlocksData();
  const latestBatchQuery = useHomeLatestBatchData();

  const value = React.useMemo<HomeDataContextValue>(() => ({
    blocksQuery,
    latestBatchQuery,
  }), [ blocksQuery, latestBatchQuery ]);

  return (
    <HomeDataContext.Provider value={ value }>
      { children }
    </HomeDataContext.Provider>
  );
}

export function useHomeDataContext(): HomeDataContextValue {
  const ctx = React.useContext(HomeDataContext);
  if (!ctx) {
    throw new Error('useHomeDataContext must be used within HomeDataContextProvider');
  }
  return ctx;
}

export function useHomeBlocksQuery(): HomeBlocksQueryResult {
  return useHomeDataContext().blocksQuery;
}

export function useHomeLatestBatchQuery(): HomeLatestBatchQueryResult | undefined {
  return useHomeDataContext().latestBatchQuery;
}
