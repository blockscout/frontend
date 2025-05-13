import { chakra, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs-routes';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Link } from 'toolkit/chakra/link';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

import type { TokenEnhancedData } from '../utils/tokenUtils';

interface Props {
  data: TokenEnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const secondRow = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const tokenDecimals = Number(data.token.decimals ?? 18);
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
      case 'ERC-404': {
        return (
          <>
            { data.token_id !== null && (
              <chakra.span textOverflow="ellipsis" overflow="hidden" mr={ 6 }>
                #{ data.token_id || 0 }
              </chakra.span>
            ) }
            { data.value !== null && (
              <span>
                { data.token.decimals ?
                  getCurrencyValue({ value: data.value, decimals: data.token.decimals, accuracy: 2 }).valueStr :
                  BigNumber(data.value).toFormat()
                }
              </span>
            ) }
          </>
        );
      }
    }
  })();

  const url = route({ pathname: '/token/[hash]', query: { hash: data.token.address_hash } });

  return (
    <Link
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="border.divider"
      borderBottomWidth="1px"
      _hover={{
        bgColor: { _light: 'blue.50', _dark: 'gray.800' },
      }}
      color="unset"
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
          mr={ 2 }
        />
        { data.usd && (
          <TruncatedValue value={ `$${ data.usd.toFormat(2) }` } fontWeight={ 700 } minW="120px" ml="auto" textAlign="right"/>
        ) }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" whiteSpace="nowrap">
        { secondRow }
      </Flex>
    </Link>
  );
};

export default React.memo(TokenSelectItem);
