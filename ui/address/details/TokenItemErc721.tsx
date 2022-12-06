import { Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import TokenLogo from 'ui/shared/TokenLogo';

import TokenItem from './TokenItem';

interface Props {
  data: AddressTokenBalance;
}

const TokenItemErc721 = ({ data }: Props) => {
  return (
    <TokenItem>
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name }</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Text >{ BigNumber(data.value).toFormat() } { data.token.symbol }</Text>
      </Flex>
    </TokenItem>
  );
};

export default React.memo(TokenItemErc721);
