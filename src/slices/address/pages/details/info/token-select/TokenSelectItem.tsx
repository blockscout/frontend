// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { isConfidentialTokenType, isFungibleTokenType } from 'src/slices/token/utils/token-types';

import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NativeTokenTag from 'src/slices/token/components/NativeTokenTag';
import type { TokenEnhancedData } from 'src/slices/token/pages/address/utils';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';
import { route } from 'src/shared/router/routes';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';

import { Link } from 'src/toolkit/chakra/link';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props {
  data: TokenEnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const isNativeToken = config.slices.address.nativeTokenAddress &&
    data.token?.address_hash.toLowerCase() === config.slices.address.nativeTokenAddress.toLowerCase();

  const chain = React.useMemo(() => {
    if (!data.chain_values) {
      return;
    }

    const chainId = Object.keys(data.chain_values)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ data.chain_values ]);

  if (!data.token) {
    return null;
  }

  const secondRow = (() => {
    if (isConfidentialTokenType(data.token.type)) {
      const text = `••••• ${ data.token.symbol || '' }`;

      return (
        <>
          <TruncatedText text={ text }/>
          { data.token.exchange_rate && <chakra.span ml={ 2 }>@{ Number(data.token.exchange_rate).toLocaleString() }</chakra.span> }
        </>
      );
    }

    const isFungibleToken = isFungibleTokenType(data.token.type, chain?.app_config);

    if (isFungibleToken) {
      const tokenDecimals = Number(data.token.decimals ?? 18);
      const text = `${ BigNumber(data.value ?? '0').dividedBy(10 ** tokenDecimals).toFormat() } ${ data.token.symbol || '' }`;

      return (
        <>
          <TruncatedText text={ text }/>
          { data.token.exchange_rate && <chakra.span ml={ 2 }>@{ Number(data.token.exchange_rate).toLocaleString() }</chakra.span> }
        </>
      );
    }

    switch (data.token.type) {
      case 'ERC-721': {
        const text = `${ BigNumber(data.value ?? '0').toFormat() } ${ data.token.symbol || '' }`;
        return <TruncatedText text={ text }/>;
      }
      case 'ERC-1155': {
        return (
          <>
            <chakra.span textOverflow="ellipsis" overflow="hidden" mr={ 6 }>
              #{ data.token_id || 0 }
            </chakra.span>
            <span>
              { BigNumber(data.value ?? '0').toFormat() }
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
                  calculateUsdValue({ amount: data.value, decimals: data.token.decimals }).valueStr :
                  BigNumber(data.value).toFormat()
                }
              </span>
            ) }
          </>
        );
      }
    }
  })();

  const url = route({ pathname: '/token/[hash]', query: { hash: data.token.address_hash } }, { chain });

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
      <Flex alignItems="center" w="100%">
        <TokenEntity
          token={ data.token }
          chain={ chain }
          noSymbol
          noCopy
          noLink
          fontWeight={ 700 }
          width="auto"
          mr={ 2 }
        />
        { isNativeToken && <NativeTokenTag mr={ 2 }/> }
        { data.usd && (
          <TruncatedText
            text={ `$${ data.usd.toFormat(2) }` }
            fontWeight={ 700 }
            minW="120px"
            ml="auto"
            textAlign="right"
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" whiteSpace="nowrap" color={ isNativeToken ? 'text.secondary' : undefined }>
        { secondRow }
      </Flex>
    </Link>
  );
};

export default React.memo(TokenSelectItem);
