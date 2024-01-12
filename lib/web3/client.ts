import { createPublicClient, http } from 'viem';

import currentChain from './currentChain';

export const publicClient = createPublicClient({
  chain: currentChain,
  transport: http(),
});
