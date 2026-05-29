// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { route } from 'src/server/routes';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.Hash;
  chain: ClusterChainConfig;
}

const SearchResultItemTx = ({ data, chain }: Props) => {
  return (
    <SearchResultListItem
      href={ route({ pathname: '/tx/[hash]', query: { hash: String(data.hash) } }, { chain }) }
    >
      <TxEntity
        hash={ data.hash }
        chain={ chain }
        noLink
        noCopy
        fontWeight="700"
        w="100%"
      />
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemTx);
