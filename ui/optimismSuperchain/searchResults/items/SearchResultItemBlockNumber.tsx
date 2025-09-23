import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { ChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import BlockEntity from 'ui/shared/entities/block/BlockEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.ChainBlockNumber;
  chain: ChainConfig;
}

const SearchResultItemBlockNumber = ({ data, chain }: Props) => {
  return (
    <SearchResultListItem
      href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.block_number) } }, { chain }) }
    >
      <BlockEntity
        number={ data.block_number }
        chain={ chain }
        noLink
        noCopy
        fontWeight="700"
      />
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemBlockNumber);
