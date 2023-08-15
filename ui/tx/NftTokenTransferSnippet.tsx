import { Flex, Link, Text, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import { route } from 'nextjs-routes';

import nftIcon from 'icons/nft_shield.svg';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';

interface Props {
  token: TokenInfo;
  value: string;
  tokenId: string;
}

const NftTokenTransferSnippet = ({ value, token, tokenId }: Props) => {
  const num = value === '1' ? '' : value;
  const url = route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: tokenId } });

  return (
    <Flex alignItems="center" columnGap={ 3 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <Text fontWeight={ 500 } as="span">For { num } token ID:</Text>
      <Box display="inline-flex" alignItems="center">
        <Icon as={ nftIcon } boxSize={ 6 } mr={ 1 }/>
        <Link href={ url } fontWeight={ 600 } overflow="hidden">
          { tokenId.length > 8 ? <HashStringShorten hash={ tokenId }/> : tokenId }
        </Link>
      </Box>
      { token.name ? (
        <TokenSnippet data={ token } logoSize={ 5 } columnGap={ 1 }/>
      ) : (
        <AddressLink hash={ token.address } truncation="constant" type="token"/>
      ) }
    </Flex>
  );
};

export default React.memo(NftTokenTransferSnippet);
