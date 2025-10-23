import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import getContractName from 'lib/multichain/getContractName';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.GetAddressResponse;
  isMobile?: boolean;
}

const SearchResultItemAddress = ({ data, isMobile }: Props) => {

  const contractName = getContractName(data);

  return (
    <SearchResultListItem
      href={ route({ pathname: '/address/[hash]', query: { hash: data.hash } }) }
    >
      <Box w={{ base: '100%', lg: '200px' }}>
        <AddressEntity
          address={{
            hash: data.hash,
            is_contract: Object.values(data.chain_infos ?? {}).every((chainInfo) => chainInfo.is_contract),
            is_verified: Object.values(data.chain_infos ?? {}).every((chainInfo) => chainInfo.is_verified),
          }}
          truncation={ !isMobile ? 'constant' : 'dynamic' }
          noLink
          noCopy
          fontWeight={{ base: '600', lg: '700' }}
        />
      </Box>
      { contractName && (
        <Box color="text.secondary" _groupHover={{ color: 'inherit' }} fontWeight={{ base: '400', lg: '500' }}>
          { contractName }
        </Box>
      ) }
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemAddress);
