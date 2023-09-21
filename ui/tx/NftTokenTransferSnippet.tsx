import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  token: TokenInfo;
  value: string;
  tokenId: string;
}

const NftTokenTransferSnippet = ({ value, token, tokenId }: Props) => {
  const num = value === '1' ? '' : value;

  return (
    <Flex alignItems="center" columnGap={ 3 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <Text fontWeight={ 500 } as="span">For { num } token ID:</Text>
      <NftEntity
        hash={ token.address }
        id={ tokenId }
        fontWeight={ 600 }
        iconSize="md"
        maxW={{ base: '100%', lg: '150px' }}
        w="auto"
        flexShrink={ 0 }
      />
      <TokenEntity
        token={ token }
        noCopy
        w="auto"
        flexGrow={ 1 }
      />
    </Flex>
  );
};

export default React.memo(NftTokenTransferSnippet);
