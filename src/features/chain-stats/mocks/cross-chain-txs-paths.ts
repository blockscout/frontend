import type { GetMessagePathsResponse } from '@blockscout/interchain-indexer-types';

import { homeChain, chainB, chainC, chainD } from 'src/features/cross-chain-txs/mocks/chains';

export const incomingMessagesPaths: GetMessagePathsResponse = {
  items: [
    {
      source_chain: chainB,
      destination_chain: homeChain,
      messages_count: 7282,
    },
    {
      source_chain: chainC,
      destination_chain: homeChain,
      messages_count: 0,
    },
    {
      source_chain: chainD,
      destination_chain: homeChain,
      messages_count: 420,
    },
  ],
};
