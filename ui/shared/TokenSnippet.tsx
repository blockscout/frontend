import { Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  symbol?: string | null;
  hash: string;
  name?: string | null;
  className?: string;
}

const TokenSnippet = ({ symbol, hash, name, className }: Props) => {
  return (
    <Flex className={ className } alignItems="center" columnGap={ 1 } w="100%">
      <TokenLogo boxSize={ 5 } borderRadius={ 2 } hash={ hash } name={ name }/>
      <AddressLink hash={ hash } alias={ name } type="token"/>
      { symbol && <Text variant="secondary">({ symbol })</Text> }
    </Flex>
  );
};

export default chakra(TokenSnippet);
