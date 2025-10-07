import essentialDappsChains from 'configs/essentialDappsChains';

// Cache for block timestamp requests across the session
const timestampCache = new Map<string, Promise<number>>();

export default async function getBlockTimestamp(
  chainId: number,
  blockNumber: bigint,
  signal?: AbortSignal,
): Promise<number> {
  const cacheKey = `${ chainId }:${ blockNumber.toString() }`;
  const cached = timestampCache.get(cacheKey);
  if (cached) return cached;

  const baseUrl = essentialDappsChains[chainId];
  if (!baseUrl) {
    // Fallback to 0 timestamp if chain is not supported
    const zero = Promise.resolve(0);
    timestampCache.set(cacheKey, zero);
    return zero;
  }

  const url = `${ baseUrl }/api/v2/blocks/${ blockNumber.toString() }`;
  const promise = fetch(url, { signal })
    .then(async(res) => {
      if (!res.ok) return 0;
      const data = await res.json() as { timestamp?: string };
      const ts = data?.timestamp ? Date.parse(data.timestamp) : 0;
      return isNaN(ts) ? 0 : ts;
    });

  timestampCache.set(cacheKey, promise);
  return promise;
}
