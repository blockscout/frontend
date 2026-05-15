// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';
import type { Block } from 'client/slices/block/types/api';

import useApiQuery, { getResourceKey } from 'client/api/hooks/useApiQuery';
import type { ResourceError, ResourcePayload } from 'client/api/resources';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import { BLOCK } from 'client/slices/block/stubs/block';

import config from 'configs/app';

/** Max blocks kept in React Query cache for `general:homepage_blocks` (fetch + socket). */
const HOME_BLOCKS_QUERY_LIMIT = 5;

const isHomepageBlocksDataEnabled = (() => {
  const rollupFeature = config.features.rollup;
  const isLatestBlocksReplacedByBatches = rollupFeature.isEnabled &&
    !rollupFeature.homepage.showLatestBlocks &&
    [ 'arbitrum' ].includes(rollupFeature.type);

  return !isLatestBlocksReplacedByBatches || config.UI.homepage.stats.includes('total_blocks');
})();

export type HomeBlocksQueryResult = UseQueryResult<
  ResourcePayload<'general:homepage_blocks'>,
  ResourceError<unknown>
>;

export default function useHomeBlocksData(): HomeBlocksQueryResult | undefined {
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

  return isHomepageBlocksDataEnabled ? blocksQuery : undefined;
}
