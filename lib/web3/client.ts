import { createPublicClient, http } from 'viem';

import { currentChain } from './chains';

export const publicClient = (() => {
  // TODO @tom2drum public clients for multichain (currently used only in degradation views)
  if (currentChain?.rpcUrls.default.http.filter(Boolean).length === 0) {
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
