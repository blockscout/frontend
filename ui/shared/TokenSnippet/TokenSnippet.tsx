import { Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  symbol?: string | null;
  hash: string;
  name?: string | null;
  className?: string;
  logoSize?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const TokenSnippet = ({ symbol, hash, name, className, logoSize = 6, isDisabled, isLoading }: Props) => {
  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 } w="100%">
      <TokenLogo boxSize={ logoSize } hash={ hash } name={ name } isLoading={ isLoading }/>
      <AddressLink hash={ hash } alias={ name } type="token" isDisabled={ isDisabled } isLoading={ isLoading }/>
      { symbol && <Text variant="secondary">({ symbol })</Text> }
    </Flex>
  );
};

export default chakra(TokenSnippet);
