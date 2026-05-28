// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, VStack, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { WatchlistAddress } from 'client/features/account/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { currencyUnits } from 'client/slices/chain/units';
import * as TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import config from 'client/config';
import calculateUsdValue from 'client/shared/values/entity/calculateUsdValue';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';
import SimpleValue from 'client/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'client/shared/values/entity/utils';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { nbsp } from 'toolkit/utils/htmlEntities';

const WatchListAddressItem = ({ item, isLoading }: { item: WatchlistAddress; isLoading?: boolean }) => {
  const nativeTokenData = React.useMemo(() => ({
    name: config.chain.currency.name || '',
    icon_url: '',
    symbol: '',
    address_hash: '',
    type: 'ERC-20' as const,
    reputation: null,
  }), [ ]);

  const { usdBn: usdNative } = calculateUsdValue(
    {
      amount: item.address_balance,
      exchangeRate: item.exchange_rate,
      decimals: String(config.chain.currency.decimals),
    },
  );

  return (
    <VStack gap={ 3 } align="stretch" fontWeight={ 500 }>
      <AddressEntity
        address={ item.address }
        isLoading={ isLoading }
        fontWeight="600"
        py="2px"
      />
      <Flex fontSize="sm" pl={ 7 } flexWrap="wrap" alignItems="center" rowGap={ 1 }>
        <TokenEntity.Icon
          token={ nativeTokenData }
          isLoading={ isLoading }
        />
        <Skeleton loading={ isLoading } whiteSpace="pre" display="inline-flex">
          <span>{ currencyUnits.ether } balance: </span>
          <NativeCoinValue
            amount={ item.address_balance }
            exchangeRate={ item.exchange_rate }
            noSymbol
          />
        </Skeleton>
      </Flex>
      { Boolean(item.tokens_count) && (
        <HStack gap={ 2 } fontSize="sm" pl={ 7 }>
          <SpriteIcon name="tokens" boxSize={ 5 } isLoading={ isLoading } borderRadius="sm"/>
          <Skeleton loading={ isLoading } display="inline-flex">
            <span>{ `Tokens:${ nbsp }` + item.tokens_count + (item.tokens_overflow ? '+' : '') }</span>
            <Text color="text.secondary">{ `${ nbsp }($${ BigNumber(item.tokens_fiat_value).toFormat(2) })` }</Text>
          </Skeleton>
        </HStack>
      ) }
      { Boolean(item.tokens_fiat_value) && (
        <SimpleValue
          value={ BigNumber(item.tokens_fiat_value).plus(usdNative) }
          prefix="$"
          startElement={ (
            <HStack>
              <SpriteIcon boxSize={ 5 } name="wallet" isLoading={ isLoading }/>
              <span>Net worth:{ nbsp }</span>
            </HStack>
          ) }
          accuracy={ DEFAULT_ACCURACY_USD }
          loading={ isLoading }
          overflowed={ item.tokens_overflow }
          pl={ 7 }
          fontSize="sm"
        />
      ) }
    </VStack>
  );
};

export default WatchListAddressItem;
