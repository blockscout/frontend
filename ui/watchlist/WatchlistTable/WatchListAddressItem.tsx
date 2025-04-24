import { HStack, VStack, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { nbsp } from 'toolkit/utils/htmlEntities';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

const WatchListAddressItem = ({ item, isLoading }: { item: WatchlistAddress; isLoading?: boolean }) => {
  const nativeTokenData = React.useMemo(() => ({
    name: config.chain.currency.name || '',
    icon_url: '',
    symbol: '',
    address_hash: '',
    type: 'ERC-20' as const,
  }), [ ]);

  const { usdBn: usdNative } = getCurrencyValue({ value: item.address_balance, accuracy: 2, accuracyUsd: 2, exchangeRate: item.exchange_rate });

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
          <CurrencyValue
            value={ item.address_balance }
            exchangeRate={ item.exchange_rate }
            decimals={ String(config.chain.currency.decimals) }
            accuracy={ 2 }
            accuracyUsd={ 2 }
          />
        </Skeleton>
      </Flex>
      { Boolean(item.tokens_count) && (
        <HStack gap={ 2 } fontSize="sm" pl={ 7 }>
          <IconSvg name="tokens" boxSize={ 5 } isLoading={ isLoading } borderRadius="sm"/>
          <Skeleton loading={ isLoading } display="inline-flex">
            <span>{ `Tokens:${ nbsp }` + item.tokens_count + (item.tokens_overflow ? '+' : '') }</span>
            <Text color="text.secondary">{ `${ nbsp }($${ BigNumber(item.tokens_fiat_value).toFormat(2) })` }</Text>
          </Skeleton>
        </HStack>
      ) }
      { Boolean(item.tokens_fiat_value) && (
        <HStack gap={ 2 } fontSize="sm" pl={ 7 }>
          <IconSvg boxSize={ 5 } name="wallet" isLoading={ isLoading }/>
          <Skeleton loading={ isLoading } display="inline-flex">
            <Text>{ `Net worth:${ nbsp }` }
              {
                `${ item.tokens_overflow ? '>' : '' }
                $${ BigNumber(item.tokens_fiat_value).plus((BigNumber(item.address_balance ? usdNative : '0'))).toFormat(2) }`
              }
            </Text>
          </Skeleton>
        </HStack>
      ) }
    </VStack>
  );
};

export default WatchListAddressItem;
