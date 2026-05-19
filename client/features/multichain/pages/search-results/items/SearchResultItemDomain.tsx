// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';
import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import EnsEntity from 'client/features/name-services/domains/components/EnsEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.Domain;
}

const SearchResultItemDomain = ({ data }: Props) => {
  return (
    <SearchResultListItem
      href={ route({ pathname: '/address/[hash]', query: { hash: String(data.address) } }) }
    >
      <EnsEntity
        domain={ data.name }
        protocol={ data.protocol as bens.ProtocolInfo }
        noLink
        noCopy
        fontWeight={{ base: '600', lg: '700' }}
        w="100%"
      />
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemDomain);
