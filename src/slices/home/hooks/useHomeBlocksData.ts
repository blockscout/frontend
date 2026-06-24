// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { ResourceError, ResourcePayload } from 'src/api/resources';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { BLOCK } from 'src/slices/block/stubs/block';

import config from 'src/config';

/** Max blocks kept in React Query cache for `core:homepage_blocks` (fetch + socket). */
const HOME_BLOCKS_QUERY_LIMIT = 5;

const isHomepageBlocksDataEnabled = (() => {
  const rollupFeature = config.features.rollup;
  const isLatestBlocksReplacedByBatches = rollupFeature.isEnabled &&
    !rollupFeature.homepage.showLatestBlocks &&
    [ 'arbitrum' ].includes(rollupFeature.type);

  return !isLatestBlocksReplacedByBatches || config.slices.home.stats.includes('total_blocks');
})();

export type HomeBlocksQueryResult = UseQueryResult<
  ResourcePayload<'core:homepage_blocks'>,
  ResourceError<unknown>
>;

export default function useHomeBlocksData(): HomeBlocksQueryResult | undefined {
  const queryClient = useQueryClient();

  const blocksQuery = useApiQuery('core:homepage_blocks', {
    queryOptions: {
      enabled: isHomepageBlocksDataEnabled,
      placeholderData: Array(HOME_BLOCKS_QUERY_LIMIT).fill(BLOCK),
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('core:homepage_blocks'), (prevData: operations['MainPageController.blocks']['json'] | undefined) => {
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
