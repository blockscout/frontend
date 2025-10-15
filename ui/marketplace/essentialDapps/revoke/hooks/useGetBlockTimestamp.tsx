import { useCallback } from 'react';

import type { Block } from 'types/api/block';
import type { ChainConfig } from 'types/multichain';

import useApiFetch from 'lib/api/useApiFetch';

// Cache for block timestamp requests across the session
const timestampCache = new Map<string, Promise<number>>();

export default function useGetBlockTimestamp() {
  const apiFetch = useApiFetch();

  return useCallback(async(
    chain: ChainConfig | undefined,
    blockNumber: bigint,
    signal?: AbortSignal,
  ): Promise<number> => {
    const cacheKey = `${ chain?.config.chain.id }:${ blockNumber.toString() }`;
    const cached = timestampCache.get(cacheKey);
    if (cached) return cached;

    const response = (apiFetch('general:block', {
      pathParams: { height_or_hash: blockNumber.toString() },
      chain,
      fetchParams: {
        signal,
      },
    }) as Promise<Block>)
      .then((data) => data.timestamp ? Date.parse(data.timestamp) : 0)
      .catch((err) => {
        timestampCache.delete(cacheKey);
        throw err;
      });

    timestampCache.set(cacheKey, response);

    return response;
  }, [ apiFetch ]);
}
