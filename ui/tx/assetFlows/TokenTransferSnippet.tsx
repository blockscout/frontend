import { Flex } from '@chakra-ui/react';
import React from 'react';

import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Token {
  address: string | undefined;
  id?: string | undefined;
  name: string | undefined;
  symbol: string | undefined;
}

interface Props {
  token: Token;
  tokenId: string;
}

const TokenTransferSnippet = ({ token, tokenId }: Props) => {
  return (
    <Flex alignItems="center" columnGap={ 2 } rowGap={ 2 } flexWrap="wrap">
      <TokenEntity
        token={ token }
        noCopy
        w="fit-content"
        flexGrow={ 1 }
        fontWeight="500"
        fontSize="lg"
        noTruncate
        display="flex"
        flexWrap="wrap"
      />
      <NftEntity
        hash={ token.address }
        id={ tokenId }
        fontWeight={ 600 }
        fontSize="lg"
        iconSize="md"
        w="auto"
        flexShrink={ 0 }
      />
    </Flex>
  );
};

export default React.memo(TokenTransferSnippet);
