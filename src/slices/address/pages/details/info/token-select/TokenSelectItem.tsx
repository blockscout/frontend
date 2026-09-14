// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { isConfidentialTokenType, isFungibleTokenType } from 'src/slices/token/utils/token-types';

import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NativeTokenTag from 'src/slices/token/components/NativeTokenTag';
import TokenMultiplierTag from 'src/slices/token/components/TokenMultiplierTag';
import type { TokenEnhancedData } from 'src/slices/token/pages/address/utils';
import { getUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';
import { route } from 'src/shared/router/routes';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';

import { Link } from 'src/toolkit/chakra/link';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

const DEFAULT_FUNGIBLE_DECIMALS = 18;
const FULL_PRECISION = 0;

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
          <Truncate value={ text } type="end"/>
          { data.token.exchange_rate && <chakra.span ml={ 2 }>@{ Number(data.token.exchange_rate).toLocaleString() }</chakra.span> }
        </>
      );
    }

    const isFungibleToken = isFungibleTokenType(data.token.type, chain?.app_config);

    if (isFungibleToken) {
      const multiplier = getUiMultiplier(data.token, chain?.app_config);
      const { valueStr } = calculateUsdValue({
        amount: data.value,
        decimals: data.token.decimals ?? DEFAULT_FUNGIBLE_DECIMALS,
        multiplier,
        accuracy: FULL_PRECISION,
      });
      const text = `${ valueStr } ${ data.token.symbol || '' }`;
      const exchangeRate = data.token.exchange_rate ? `@${ Number(data.token.exchange_rate).toLocaleString() }` : undefined;

      return (
        <>
          <Flex alignItems="center" gap={ 1 } maxW={ exchangeRate ? '60%' : '100%' }>
            { multiplier && <TokenMultiplierTag multiplier={ multiplier }/> }
            <Truncate value={ text } type="end"/>
          </Flex>
          { exchangeRate && <Truncate value={ exchangeRate } type="end" maxW="40%" ml={ 2 }/> }
        </>
      );
    }

    switch (data.token.type) {
      case 'ERC-721': {
        const text = `${ BigNumber(data.value ?? '0').toFormat() } ${ data.token.symbol || '' }`;
        return <Truncate value={ text } type="end"/>;
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
          <Truncate value={ `$${ data.usd.toFormat(2) }` } type="end" fontWeight={ 700 }
            minW="120px"
            ml="auto"
            textAlign="right"
            color={ isNativeToken ? 'text.secondary' : undefined }/>
        ) }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" whiteSpace="nowrap" color={ isNativeToken ? 'text.secondary' : undefined }>
        { secondRow }
      </Flex>
    </Link>
  );
};

export default React.memo(TokenSelectItem);
