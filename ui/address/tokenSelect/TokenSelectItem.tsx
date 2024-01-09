import { chakra, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs-routes';

import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import LinkInternal from 'ui/shared/LinkInternal';
import TruncatedValue from 'ui/shared/TruncatedValue';

import type { TokenEnhancedData } from '../utils/tokenUtils';

interface Props {
  data: TokenEnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const secondRow = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const tokenDecimals = Number(data.token.decimals) || 18;
        const text = `${ BigNumber(data.value).dividedBy(10 ** tokenDecimals).dp(8).toFormat() } ${ data.token.symbol || '' }`;

        return (
          <>
            <TruncatedValue value={ text }/>
            { data.token.exchange_rate && <chakra.span ml={ 2 }>@{ Number(data.token.exchange_rate).toLocaleString() }</chakra.span> }
          </>
        );
      }
      case 'ERC-721': {
        const text = `${ BigNumber(data.value).toFormat() } ${ data.token.symbol || '' }`;
        return <TruncatedValue value={ text }/>;
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

  const url = route({ pathname: '/token/[hash]', query: { hash: data.token.address } });

  return (
    <LinkInternal
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
      color="initial"
      fontSize="sm"
      href={ url }
    >
      <Flex alignItems="center" w="100%" overflow="hidden">
        <TokenEntity
          token={ data.token }
          noSymbol
          noCopy
          noLink
          fontWeight={ 700 }
        />
        { data.usd && <Text fontWeight={ 700 } ml="auto">${ data.usd.toFormat(2) }</Text> }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" whiteSpace="nowrap">
        { secondRow }
      </Flex>
    </LinkInternal>
  );
};

export default React.memo(TokenSelectItem);
