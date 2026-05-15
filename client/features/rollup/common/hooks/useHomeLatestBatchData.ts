// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';

import useApiQuery, { getResourceKey } from 'client/api/hooks/useApiQuery';
import type { ResourceError } from 'client/api/resources';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import config from 'configs/app';

export type HomeLatestBatchQueryResult = UseQueryResult<number, ResourceError<unknown>>;

type LatestBatchSocketEventMessage = SocketMessage.NewArbitrumL2Batch;
type LatestBatchPayload = Parameters<LatestBatchSocketEventMessage['handler']>[0];
type LatestBatchSocketMessage = LatestBatchSocketEventMessage | SocketMessage.Unknown;

const shouldShowLatestBatchStat = config.UI.homepage.stats.includes('latest_batch');

export default function useHomeLatestBatchData(): HomeLatestBatchQueryResult | undefined {
  const queryClient = useQueryClient();
  const rollupFeature = config.features.rollup;

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
    handler: handleNewLatestBatchMessage,
  } as LatestBatchSocketMessage);

  return latestBatchQuery;
}
