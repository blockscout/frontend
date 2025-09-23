import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import getContractName from 'lib/multichain/getContractName';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.GetAddressResponse;
}

const SearchResultItemAddress = ({ data }: Props) => {

  const isMobile = useIsMobile();

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
          icon={{
            shield: { name: 'pie_chart' },
          }}
          truncation={ !isMobile ? 'constant' : 'dynamic' }
          noLink
          noCopy
          fontWeight="700"
        />
      </Box>
      { contractName && (
        <Box color="text.secondary" _groupHover={{ color: 'inherit' }}>
          { contractName }
        </Box>
      ) }
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemAddress);
