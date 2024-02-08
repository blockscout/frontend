import { createPublicClient, http } from 'viem';

import currentChain from './currentChain';

export const publicClient = (() => {
  if (currentChain.rpcUrls.public.http.filter(Boolean).length === 0) {
    return;
  }

  try {
    return createPublicClient({
      chain: currentChain,
      transport: http(),
      batch: {
        multicall: true,
      },
    });
  } catch (error) {}
})();
