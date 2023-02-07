import { Flex, Link, Text, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';
import link from 'lib/link/link';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';

interface Props {
  value: string;
  tokenId: string;
  hash: string;
  name?: string | null;
  symbol?: string | null;
}

const NftTokenTransferSnippet = ({ value, name, hash, symbol, tokenId }: Props) => {
  const num = value === '1' ? '' : value;
  const url = link('token_instance_item', { hash: hash, id: tokenId });

  return (
    <Flex alignItems="center" columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
      <Text fontWeight={ 500 } as="span">For { num } token ID:</Text>
      <Box display="inline-flex" alignItems="center">
        <Icon as={ nftIcon } boxSize={ 6 } mr={ 1 }/>
        <Link href={ url } fontWeight={ 600 } overflow="hidden">
          { tokenId.length > 8 ? <HashStringShorten hash={ tokenId }/> : tokenId }
        </Link>
      </Box>
      { name ? (
        <TokenSnippet symbol={ symbol } hash={ hash } name={ name } w="auto" logoSize={ 5 } columnGap={ 1 }/>
      ) : (
        <AddressLink hash={ hash } truncation="constant" type="token"/>
      ) }
    </Flex>
  );
};

export default React.memo(NftTokenTransferSnippet);
