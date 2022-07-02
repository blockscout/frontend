import React from 'react';

import { Link, HStack, VStack, Image, Text, Icon } from '@chakra-ui/react';

import CopyToClipboard from '../CopyToClipboard/CopyToClipboard';
import type { TWatchlistItem } from '../../data/watchlist';
import { nbsp } from '../../lib/html-entities';
import TokensIcon from '../../icons/tokens.svg';
import WalletIcon from '../../icons/wallet.svg';

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  return (
    <HStack spacing={ 3 } align="top">
      <Image src="/acc.png" alt="Account Image" w="50px" h="50px"/>
      <VStack align="stretch" overflow="hidden">
        <HStack spacing={ 2 } alignContent="center">
          <Link href="#" color="blue.500" title={ item.address } overflow="hidden" textOverflow="ellipsis">
            { item.address }
          </Link>
          <CopyToClipboard text={ item.address }/>
        </HStack>
        { item.tokenBalance && (
          <HStack spacing={ 0 } fontSize="xs">
            <Image src="./xdai.png" alt="chain-logo" marginRight="10px" w="16px" h="16px"/>
            <Text>{ item.tokenBalance + ' xDAI' }</Text>
            <Text color="gray.500">{ `${ nbsp }($${ item.tokenBalanceUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.tokensAmount && (
          <HStack spacing={ 0 } fontSize="xs">
            <Icon as={ TokensIcon } marginRight="10px" w="17px" h="16px"/>
            <Text>{ item.tokensAmount + ' tokens' }</Text>
            <Text color="gray.500">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.totalUSD && (
          <HStack spacing={ 0 } fontSize="xs">
            <Icon as={ WalletIcon } marginRight="10px" w="16px" h="16px"/>
            <Text>{ `Total balance:${ nbsp }` }</Text>
            <Link href="#" color="blue.500">{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) }
      </VStack>
    </HStack>
  )
}

export default WatchListAddressItem;
