// SPDX-License-Identifier: LicenseRef-Blockscout

import { useCallback, useEffect } from 'react';
import type { PublicClient } from 'viem';

import type { schemas } from '@blockscout/api-types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

// Cache for block timestamp requests across the session
const timestampCache = new Map<string, Promise<number>>();
let activeInstances = 0;

export default function useGetBlockTimestamp() {
  // Clear entire cache when the last consumer unmounts
  useEffect(() => {
    activeInstances += 1;
    return () => {
      activeInstances -= 1;
      if (activeInstances === 0) {
        timestampCache.clear();
      }
    };
  }, []);

  return useCallback(async(
    chain: EssentialDappsChainConfig | undefined,
    publicClient: PublicClient | undefined,
    blockNumber: bigint,
    signal?: AbortSignal,
  ): Promise<number> => {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    if (!publicClient) {
      throw new Error('Public client not found');
    }

    const cacheKey = `${ chain?.id }:${ blockNumber.toString() }`;
    const cached = timestampCache.get(cacheKey);
    if (cached) return cached;

    const response = publicClient.getBlock({ blockNumber })
      .then((data) => Number(data.timestamp) * 1_000)
      .catch((err) => {
        timestampCache.delete(cacheKey);
        throw err;
      });

    timestampCache.set(cacheKey, response);

    return response;
  }, []);
}
