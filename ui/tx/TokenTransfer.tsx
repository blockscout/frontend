import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import TokenSnippet from 'ui/shared/TokenSnippet';

interface Props {
  from: string;
  to: string;
  amount: number;
  usd: number;
  token: {
    symbol: string;
    hash: string;
    name: string;
  };
}

const TokenTransfer = ({ from, to, amount, usd, token }: Props) => {
  return (
    <Flex alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={ 3 }>
      <Flex alignItems="center">
        <AddressLink fontWeight="500" hash={ from } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink fontWeight="500" hash={ to } truncation="constant"/>
      </Flex>
      <Text fontWeight={ 500 } as="span">For:{ space }
        <Text fontWeight={ 600 } as="span">{ amount }</Text>{ space }
        <Text fontWeight={ 400 } variant="secondary" as="span">(${ usd.toFixed(2) })</Text>
      </Text>
      <TokenSnippet { ...token }/>
    </Flex>
  );
};

export default TokenTransfer;
