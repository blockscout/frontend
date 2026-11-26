// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PublicClient } from 'viem';

import { currentChain } from './chains';
import { getRpcUrls } from './rpc-urls';

const rpcUrl: string | undefined = getRpcUrls().filter(Boolean)[0];

// Whether an RPC public client can be built for the current chain. Computed without importing
// viem, so consumers can gate `enabled`/render synchronously while the client itself loads lazily.
export const isPublicClientAvailable = !currentChain || Boolean(rpcUrl);

let publicClientPromise: Promise<PublicClient | undefined> | undefined;

// The first call imports viem, so call it from the async function that needs the client, not at module
// load. All callers share one client, so its multicall batching spans them.
export function getPublicClient(): Promise<PublicClient | undefined> {
  if (!isPublicClientAvailable) {
    return Promise.resolve(undefined);
  }

  publicClientPromise = publicClientPromise ?? (async() => {
    try {
      const { createPublicClient, http } = await import('viem');
      return createPublicClient({
        chain: currentChain,
        transport: http(rpcUrl),
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
