import { HStack, VStack, Flex, Skeleton, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import config from 'configs/app';
import TokensIcon from 'icons/tokens.svg';
import WalletIcon from 'icons/wallet.svg';
import getCurrencyValue from 'lib/getCurrencyValue';
import { nbsp } from 'lib/html-entities';
import Icon from 'ui/shared/chakra/Icon';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';

const WatchListAddressItem = ({ item, isLoading }: { item: WatchlistAddress; isLoading?: boolean }) => {
  const nativeTokenData = React.useMemo(() => ({
    name: config.chain.currency.name || '',
    icon_url: '',
    symbol: '',
    address: '',
    type: 'ERC-20' as const,
  }), [ ]);

  const { usdBn: usdNative } = getCurrencyValue({ value: item.address_balance, accuracy: 2, accuracyUsd: 2, exchangeRate: item.exchange_rate });

  return (
    <VStack spacing={ 3 } align="stretch" fontWeight={ 500 }>
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
        <Skeleton isLoaded={ !isLoading } whiteSpace="pre" display="inline-flex">
          <span>{ config.chain.currency.symbol } balance: </span>
          <CurrencyValue
            value={ item.address_balance }
            exchangeRate={ item.exchange_rate }
            decimals={ String(config.chain.currency.decimals) }
            accuracy={ 2 }
            accuracyUsd={ 2 }
          />
        </Skeleton>
      </Flex>
      { item.tokens_count && (
        <HStack spacing={ 2 } fontSize="sm" pl={ 7 }>
          <Icon as={ TokensIcon } boxSize={ 5 } isLoading={ isLoading } borderRadius="sm"/>
          <Skeleton isLoaded={ !isLoading } display="inline-flex">
            <span>{ `Tokens:${ nbsp }` + item.tokens_count + (item.tokens_overflow ? '+' : '') }</span>
            <Text variant="secondary" fontWeight={ 400 }>{ `${ nbsp }($${ BigNumber(item.tokens_fiat_value).toFormat(2) })` }</Text>
          </Skeleton>
        </HStack>
      ) }
      { item.tokens_fiat_value && (
        <HStack spacing={ 2 } fontSize="sm" pl={ 7 }>
          <Icon boxSize={ 5 } as={ WalletIcon } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } display="inline-flex">
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
