import { HStack, VStack, Image, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TWatchlistItem } from 'types/client/account';

import TokensIcon from 'icons/tokens.svg';
// import WalletIcon from 'icons/wallet.svg';
import { nbsp } from 'lib/html-entities';
import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

// now this component works only for xDAI
// for other networks later we will use config or smth
const DECIMALS = 18;

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  const mainTextColor = useColorModeValue('gray.700', 'gray.50');

  const xdaiBalance = ((item.address_balance || 0) / 10 ** DECIMALS).toFixed(1);

  return (
    <HStack spacing={ 3 } align="top">
      <AddressIcon address={ item.address_hash }/>
      <VStack spacing={ 2 } align="stretch" overflow="hidden" fontWeight={ 500 } color="gray.700">
        <AddressLinkWithTooltip address={ item.address }/>
        { item.tokenBalance && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Image src="./xdai.png" alt="chain-logo" marginRight="10px" w="16px" h="16px"/>
            <Text color={ mainTextColor }>{ `xDAI balance:${ nbsp }` + item.tokenBalance }</Text>
            <Text variant="secondary">{ `${ nbsp }($${ item.tokenBalanceUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.tokensAmount && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Icon as={ TokensIcon } marginRight="10px" w="17px" h="16px"/>
            <Text color={ mainTextColor }>{ `Tokens:${ nbsp }` + item.tokens_count }</Text>
            { /* api does not provide token prices */ }
            { /* <Text variant="secondary">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text> */ }
          </HStack>
        ) }
        { /* api does not provide token prices */ }
        { /* { item.address_balance && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Icon as={ WalletIcon } marginRight="10px" w="16px" h="16px"/>
            <Text color={ mainTextColor }>{ `Net worth:${ nbsp }` }</Text>
            <Link href="#">{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) } */ }
      </VStack>
    </HStack>
  );
};

export default WatchListAddressItem;
