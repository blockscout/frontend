import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import HashStringShorten from 'ui/shared/HashStringShorten';
import TokenLogo from 'ui/shared/TokenLogo';

import type { EnhancedData } from './utils';

interface Props {
  data: EnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const secondRow = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const tokenDecimals = Number(data.token.decimals) || 18;
        return (
          <>
            <Text >{ BigNumber(data.value).dividedBy(10 ** tokenDecimals).toFormat(2) } { data.token.symbol }</Text>
            { data.token.exchange_rate && <Text >@{ data.token.exchange_rate }</Text> }
          </>
        );
      }
      case 'ERC-721': {
        return <Text >{ BigNumber(data.value).toFormat() } { data.token.symbol }</Text>;
      }
      case 'ERC-1155': {
        return (
          <>
            <Text >#{ data.token_id || 0 }</Text>
            <Text >{ BigNumber(data.value).toFormat() }</Text>
          </>
        );
      }
    }
  })();

  return (
    <Flex
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderBottomWidth="1px"
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      cursor="pointer"
    >
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name || <HashStringShorten hash={ data.token.address }/> }</Text>
        { data.usd && <Text fontWeight={ 700 } ml="auto">${ data.usd.toFormat(2) }</Text> }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        { secondRow }
      </Flex>
    </Flex>
  );
};

export default React.memo(TokenSelectItem);
