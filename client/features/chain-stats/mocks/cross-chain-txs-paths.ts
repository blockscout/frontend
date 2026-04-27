import type { GetMessagePathsResponse } from '@blockscout/interchain-indexer-types';

import { chainA, chainB, chainC, chainD } from 'mocks/multichain/chains';

export const incomingMessagesPaths: GetMessagePathsResponse = {
  items: [
    {
      source_chain: chainB,
      destination_chain: chainA,
      messages_count: 7282,
    },
    {
      source_chain: chainC,
      destination_chain: chainA,
      messages_count: 0,
    },
    {
      source_chain: chainD,
      destination_chain: chainA,
      messages_count: 420,
    },
  ],
};
