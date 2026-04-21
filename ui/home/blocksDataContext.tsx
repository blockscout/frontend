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

const isHomepageBlocksDataEnabled = shouldShowLatestBlocks || shouldShowLatestBlockStat;

type HomeBlocksQueryResult = UseQueryResult<
  ResourcePayload<'general:homepage_blocks'>,
  ResourceError<unknown>
>;

type HomeBlocksDataContextValue = {
  blocksQuery: HomeBlocksQueryResult;
};

const HomeBlocksDataContext = React.createContext<HomeBlocksDataContextValue | null>(null);

export function HomeBlocksDataContextProvider({ children }: { children: React.ReactNode }) {
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

  const value = React.useMemo(() => ({ blocksQuery }), [ blocksQuery ]);

  return (
    <HomeBlocksDataContext.Provider value={ value }>
      { children }
    </HomeBlocksDataContext.Provider>
  );
}

export function useHomeBlocksDataContext(): HomeBlocksDataContextValue {
  const ctx = React.useContext(HomeBlocksDataContext);
  if (!ctx) {
    throw new Error('useHomeBlocksDataContext must be used within HomeBlocksDataContextProvider');
  }
  return ctx;
}

export function useHomeBlocksQuery(): HomeBlocksQueryResult {
  return useHomeBlocksDataContext().blocksQuery;
}
