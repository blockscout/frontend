import { HStack, VStack, Flex, Skeleton, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import appConfig from 'configs/app/config';
import TokensIcon from 'icons/tokens.svg';
import WalletIcon from 'icons/wallet.svg';
import getCurrencyValue from 'lib/getCurrencyValue';
import { nbsp } from 'lib/html-entities';
import AddressSnippet from 'ui/shared/AddressSnippet';
import Icon from 'ui/shared/chakra/Icon';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenLogo from 'ui/shared/TokenLogo';

const WatchListAddressItem = ({ item, isLoading }: { item: WatchlistAddress; isLoading?: boolean }) => {
  const infoItemsPaddingLeft = { base: 1, lg: 8 };

  const nativeTokenData = React.useMemo(() => ({
    address: appConfig.network.currency.address || '',
    name: appConfig.network.currency.name || '',
    icon_url: '',
  }), [ ]);

  const { usdBn: usdNative } = getCurrencyValue({ value: item.address_balance, accuracy: 2, accuracyUsd: 2, exchangeRate: item.exchange_rate });

  return (
    <VStack spacing={ 2 } align="stretch" fontWeight={ 500 }>
      <AddressSnippet address={ item.address } isLoading={ isLoading }/>
      <Flex fontSize="sm" pl={ infoItemsPaddingLeft } flexWrap="wrap" alignItems="center" rowGap={ 1 }>
        { appConfig.network.currency.address && (
          <TokenLogo
            data={ nativeTokenData }
            boxSize={ 5 }
            borderRadius="sm"
            mr={ 2 }
            isLoading={ isLoading }
          />
        ) }
        <Skeleton isLoaded={ !isLoading } whiteSpace="pre" display="inline-flex">
          <span>{ appConfig.network.currency.symbol } balance: </span>
          <CurrencyValue
            value={ item.address_balance }
            exchangeRate={ item.exchange_rate }
            decimals={ String(appConfig.network.currency.decimals) }
            accuracy={ 2 }
            accuracyUsd={ 2 }
          />
        </Skeleton>
      </Flex>
      { item.tokens_count && (
        <HStack spacing={ 2 } fontSize="sm" pl={ infoItemsPaddingLeft }>
          <Icon as={ TokensIcon } boxSize={ 5 } isLoading={ isLoading } borderRadius="sm"/>
          <Skeleton isLoaded={ !isLoading } display="inline-flex">
            <span>{ `Tokens:${ nbsp }` + item.tokens_count + (item.tokens_overflow ? '+' : '') }</span>
            <Text variant="secondary" fontWeight={ 400 }>{ `${ nbsp }($${ BigNumber(item.tokens_fiat_value).toFormat(2) })` }</Text>
          </Skeleton>
        </HStack>
      ) }
      { item.tokens_fiat_value && (
        <HStack spacing={ 2 } fontSize="sm" pl={ infoItemsPaddingLeft }>
          <Icon boxSize={ 5 } as={ WalletIcon } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } display="inline-flex">
            <Text>{ `Net worth:${ nbsp }` }
              { `${ item.tokens_overflow ? '>' : '' }$${ BigNumber(item.tokens_fiat_value).plus((BigNumber(usdNative ? usdNative : '0'))).toFormat(2) }` }
            </Text>
          </Skeleton>
        </HStack>
      ) }
    </VStack>
  );
};

export default WatchListAddressItem;
