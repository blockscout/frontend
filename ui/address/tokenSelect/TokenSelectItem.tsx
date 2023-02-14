import { chakra, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import link from 'lib/link/link';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import HashStringShorten from 'ui/shared/HashStringShorten';
import TokenLogo from 'ui/shared/TokenLogo';

import type { TokenEnhancedData } from '../utils/tokenUtils';

interface Props {
  data: TokenEnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const secondRow = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const tokenDecimals = Number(data.token.decimals) || 18;
        return (
          <>
            <span >{ BigNumber(data.value).dividedBy(10 ** tokenDecimals).toFormat(2) } { trimTokenSymbol(data.token.symbol) }</span>
            { data.token.exchange_rate && <span >@{ data.token.exchange_rate }</span> }
          </>
        );
      }
      case 'ERC-721': {
        return <chakra.span textOverflow="ellipsis" overflow="hidden">{ BigNumber(data.value).toFormat() } { data.token.symbol }</chakra.span>;
      }
      case 'ERC-1155': {
        return (
          <>
            <chakra.span textOverflow="ellipsis" overflow="hidden" mr={ 6 }>
              #{ data.token_id || 0 }
            </chakra.span>
            <span>
              { BigNumber(data.value).toFormat() }
            </span>
          </>
        );
      }
    }
  })();

  // TODO add filter param when token page is ready
  const url = link('token_index', { hash: data.token.address });

  return (
    <Flex
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="divider"
      borderBottomWidth="1px"
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      cursor="pointer"
      as="a"
      href={ url }
    >
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name || <HashStringShorten hash={ data.token.address }/> }</Text>
        { data.usd && <Text fontWeight={ 700 } ml="auto">${ data.usd.toFormat(2) }</Text> }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" whiteSpace="nowrap">
        { secondRow }
      </Flex>
    </Flex>
  );
};

export default React.memo(TokenSelectItem);
