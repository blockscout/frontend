// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PublicClient } from 'viem';

import { currentChain } from './chains';

// Whether an RPC public client can be built for the current chain. Computed without importing
// viem, so consumers can gate `enabled`/render synchronously while the client itself loads lazily.
export const isPublicClientAvailable =
  !currentChain || currentChain.rpcUrls.default.http.filter(Boolean).length > 0;

let publicClientPromise: Promise<PublicClient | undefined> | undefined;

// Lazily builds (once) the viem public client, importing viem only on the first call. Every consumer
// calls this inside an async query/watch function, so viem stays out of the critical bundle. Memoized,
// so callers share a single client instance (viem request batching / multicall behaviour is preserved).
export function getPublicClient(): Promise<PublicClient | undefined> {
  if (!isPublicClientAvailable) {
    return Promise.resolve(undefined);
  }

  publicClientPromise = publicClientPromise ?? (async() => {
    try {
      const { createPublicClient, http } = await import('viem');
      return createPublicClient({
        chain: currentChain,
        transport: http(),
        batch: {
          multicall: true,
        },
      });
    } catch {
      return undefined;
    }
  })();

  return publicClientPromise;
}
