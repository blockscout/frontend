// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressFungibleTokensItem } from '../types';
import { getTokenTypeName, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NativeTokenTag from 'src/slices/token/components/NativeTokenTag';

import multichainConfig from 'src/features/multichain/chains-config';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

type Props = AddressFungibleTokensItem & { isLoading: boolean; hasAdditionalTokenTypes?: boolean };

const AddressFungibleTokensListItem = ({
  token,
  value,
  isLoading,
  chain_values: chainValues,
  hasAdditionalTokenTypes,
}: Props) => {
  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: value, exchangeRate: token.exchange_rate, decimals: token.decimals });

  const isNativeToken = config.slices.address.nativeTokenAddress &&
    token.address_hash.toLowerCase() === config.slices.address.nativeTokenAddress.toLowerCase();

  const chainInfo = React.useMemo(() => {
    if (!chainValues) {
      return;
    }

    const chainId = Object.keys(chainValues)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainValues ]);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%" columnGap={ 2 }>
        <TokenEntity
          token={ token }
          chain={ chainInfo }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
          width="auto"
        />
        { isNativeToken && <NativeTokenTag/> }
        { hasAdditionalTokenTypes && <Tag loading={ isLoading }>{ getTokenTypeName(token.type) }</Tag> }
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressEntity
          address={{ hash: token.address_hash }}
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
        <TokenAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
      </Flex>
      { token.exchange_rate !== undefined && token.exchange_rate !== null && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Price</Skeleton>
          <SimpleValue
            value={ BigNumber(token.exchange_rate) }
            loading={ isLoading }
            prefix="$"
            fontSize="sm"
            color="text.secondary"
          />
        </HStack>
      ) }
      <HStack gap={ 3 } alignItems="baseline">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Quantity</Skeleton>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <SimpleValue
            value={ tokenQuantity }
            loading={ isLoading }
            fontSize="sm"
            color="text.secondary"
          />
        ) }
      </HStack>
      { isConfidentialTokenType(token.type) && (
        <HStack gap={ 3 } alignItems="baseline">
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value</Skeleton>
          <ConfidentialValue loading={ isLoading }/>
        </HStack>
      ) }
      { !isConfidentialTokenType(token.type) && token.exchange_rate && (
        <HStack gap={ 3 } alignItems="baseline">
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value</Skeleton>
          <SimpleValue
            value={ tokenValue }
            prefix="$"
            loading={ isLoading }
            accuracy={ DEFAULT_ACCURACY_USD }
            fontSize="sm"
            color="text.secondary"
          />
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default AddressFungibleTokensListItem;
