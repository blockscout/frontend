import { createPublicClient, http } from 'viem';

import currentChain from './currentChain';

export const publicClient = (() => {
  if (currentChain.rpcUrls.public.http.filter(Boolean).length === 0) {
    return;
  }

  return createPublicClient({
    chain: currentChain,
    transport: http(),
    batch: {
      multicall: true,
    },
  });
})();
