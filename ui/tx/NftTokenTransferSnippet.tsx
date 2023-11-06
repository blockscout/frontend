import { Flex, chakra } from '@chakra-ui/react';
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
    <Flex alignItems="center" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { num ? (
        <>
          <chakra.span color="text_secondary">for</chakra.span>
          <span>{ num }</span>
          <chakra.span color="text_secondary">token ID</chakra.span>
        </>
      ) : (
        <chakra.span color="text_secondary">for token ID</chakra.span>
      ) }
      <NftEntity
        hash={ token.address }
        id={ tokenId }
        fontWeight={ 600 }
        iconSize="md"
        maxW={{ base: '100%', lg: '150px' }}
        w="auto"
        flexShrink={ 0 }
      />
      <chakra.span color="text_secondary">of</chakra.span>
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
