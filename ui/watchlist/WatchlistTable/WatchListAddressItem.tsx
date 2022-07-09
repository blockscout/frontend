import React from 'react';

import { Link, HStack, VStack, Image, Text, Icon } from '@chakra-ui/react';

import AddressIcon from '../../shared/AddressIcon';
import AddressLinkWithTooltip from '../../shared/AddressLinkWithTooltip';
import type { TWatchlistItem } from '../../../data/watchlist';
import { nbsp } from '../../../lib/html-entities';
import TokensIcon from '../../../icons/tokens.svg';
import WalletIcon from '../../../icons/wallet.svg';

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  return (
    <HStack spacing={ 3 } align="top">
      <AddressIcon address={ item.address }/>
      <VStack spacing={ 2 } align="stretch" overflow="hidden" fontWeight={ 500 } color="gray.700">
        <AddressLinkWithTooltip address={ item.address }/>
        { item.tokenBalance && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Image src="./xdai.png" alt="chain-logo" marginRight="10px" w="16px" h="16px"/>
            <Text>{ `xDAI balance:${ nbsp }` + item.tokenBalance }</Text>
            <Text color="gray.500">{ `${ nbsp }($${ item.tokenBalanceUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.tokensAmount && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Icon as={ TokensIcon } marginRight="10px" w="17px" h="16px"/>
            <Text>{ `Tokens:${ nbsp }` + item.tokensAmount }</Text>
            <Text color="gray.500">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.totalUSD && (
          <HStack spacing={ 0 } fontSize="sm" h={ 6 }>
            <Icon as={ WalletIcon } marginRight="10px" w="16px" h="16px"/>
            <Text>{ `Net worth:${ nbsp }` }</Text>
            <Link href="#" color="blue.500" _hover={{ color: 'blue.400' }}>{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) }
      </VStack>
    </HStack>
  )
}

export default WatchListAddressItem;
