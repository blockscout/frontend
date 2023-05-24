import { HStack, VStack, chakra, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TWatchlistItem } from 'types/client/account';

import appConfig from 'configs/app/config';
import TokensIcon from 'icons/tokens.svg';
// import WalletIcon from 'icons/wallet.svg';
import { nbsp } from 'lib/html-entities';
import AddressSnippet from 'ui/shared/AddressSnippet';
import Icon from 'ui/shared/chakra/Icon';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenLogo from 'ui/shared/TokenLogo';

const WatchListAddressItem = ({ item, isLoading }: { item: TWatchlistItem; isLoading?: boolean }) => {
  const infoItemsPaddingLeft = { base: 1, lg: 8 };

  const nativeTokenData = React.useMemo(() => ({
    address: appConfig.network.currency.address || '',
    name: appConfig.network.currency.name || '',
    icon_url: '',
  }), [ ]);

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
            <span>{ `Tokens:${ nbsp }` + item.tokens_count }</span>
            { /* api does not provide token prices */ }
            { /* <Text variant="secondary">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text> */ }
            <chakra.span color="text_secondary">{ `${ nbsp }(N/A)` }</chakra.span>
          </Skeleton>
        </HStack>
      ) }
      { /* api does not provide token prices */ }
      { /* { item.address_balance && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 } pl={ infoItemsPaddingLeft }>
            <Icon as={ WalletIcon } mr={ 2 } w="16px" h="16px"/>
            <Text>{ `Net worth:${ nbsp }` }</Text>
            <Link href="#">{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) } */ }
    </VStack>
  );
};

export default WatchListAddressItem;
