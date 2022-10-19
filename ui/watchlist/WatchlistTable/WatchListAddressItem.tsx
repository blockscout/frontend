import { HStack, VStack, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TWatchlistItem } from 'types/client/account';

import appConfig from 'configs/app/config';
import TokensIcon from 'icons/tokens.svg';
// import WalletIcon from 'icons/wallet.svg';
import { nbsp } from 'lib/html-entities';
import AddressSnippet from 'ui/shared/AddressSnippet';
import TokenLogo from 'ui/shared/TokenLogo';

const DECIMALS = 18;

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  const mainTextColor = useColorModeValue('gray.700', 'gray.50');

  const nativeBalance = ((item.address_balance || 0) / 10 ** DECIMALS).toFixed(1);
  const nativeBalanceUSD = item.exchange_rate ? `$${ Number(nativeBalance) * item.exchange_rate } USD` : 'N/A';
  const infoItemsPaddingLeft = { base: 0, lg: 10 };

  return (
    <VStack spacing={ 2 } align="stretch" overflow="hidden" fontWeight={ 500 } color="gray.700">
      <AddressSnippet address={ item.address_hash }/>
      <HStack spacing={ 0 } fontSize="sm" h={ 6 } pl={ infoItemsPaddingLeft }>
        { appConfig.network.nativeTokenAddress &&
          <TokenLogo hash={ appConfig.network.nativeTokenAddress } name={ appConfig.network.name } boxSize={ 4 } mr="10px"/> }
        <Text color={ mainTextColor }>{ `${ appConfig.network.currency.name } balance:${ nbsp }` + nativeBalance }</Text>
        <Text variant="secondary">{ `${ nbsp }(${ nativeBalanceUSD })` }</Text>
      </HStack>
      { item.tokens_count && (
        <HStack spacing={ 0 } fontSize="sm" h={ 6 } pl={ infoItemsPaddingLeft }>
          <Icon as={ TokensIcon } marginRight="10px" w="17px" h="16px"/>
          <Text color={ mainTextColor }>{ `Tokens:${ nbsp }` + item.tokens_count }</Text>
          { /* api does not provide token prices */ }
          { /* <Text variant="secondary">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text> */ }
          <Text variant="secondary">{ `${ nbsp }(N/A)` }</Text>
        </HStack>
      ) }
      { /* api does not provide token prices */ }
      { /* { item.address_balance && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 } pl={ infoItemsPaddingLeft }>
            <Icon as={ WalletIcon } marginRight="10px" w="16px" h="16px"/>
            <Text color={ mainTextColor }>{ `Net worth:${ nbsp }` }</Text>
            <Link href="#">{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) } */ }
    </VStack>
  );
};

export default WatchListAddressItem;
