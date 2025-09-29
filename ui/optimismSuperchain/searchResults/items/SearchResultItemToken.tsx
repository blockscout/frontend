import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { ChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.Token;
  chain: ChainConfig;
}

const SearchResultItemToken = ({ data, chain }: Props) => {
  return (
    <SearchResultListItem
      href={ route({ pathname: '/token/[hash]', query: { hash: data.address } }, { chain }) }
    >
      <Box w="200px">
        <TokenEntity
          token={{
            address_hash: data.address,
            icon_url: data.icon_url,
            name: data.name,
            symbol: data.symbol,
            type: 'ERC-20',
            reputation: null,
          }}
          chain={ chain }
          noLink
          jointSymbol
          noCopy
          fontWeight="700"
        />
      </Box>
      <Flex alignItems="center" w={{ base: '100%', lg: 'auto' }}>
        <Box overflow="hidden" whiteSpace="nowrap">
          <HashStringShortenDynamic hash={ data.address } fontWeight="500" color="text.secondary" _groupHover={{ color: 'inherit' }}/>
        </Box>
        { data.is_verified_contract && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
      </Flex>
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemToken);
