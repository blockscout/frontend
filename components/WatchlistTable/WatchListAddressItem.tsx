import React from 'react';

import { Link, HStack, VStack, Image, Text, Icon } from '@chakra-ui/react';

import CopyToClipboard from '../CopyToClipboard/CopyToClipboard';
import type { TWatchlistItem } from '../../data/watchlist';
import { nbsp } from '../../lib/html-entities';
import TokensIcon from '../../icons/tokens.svg';
import WalletIcon from '../../icons/wallet.svg';

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  return (
    <HStack spacing="12px" align="top">
      <Image src="/acc.png" alt="Account Image" w="50px" h="50px"/>
      <VStack align="stretch">
        <HStack spacing="8px" alignContent="center">
          <Link href="#" color="blue.500">
            { item.address }
          </Link>
          <CopyToClipboard text={ item.address }/>
        </HStack>
        { item.tokenBalance && (
          <HStack spacing="0">
            <Image src="./xdai.png" alt="chain-logo" marginRight="10px" w="16px" h="16px"/>
            <Text fontSize="12px">{ item.tokenBalance + ' xDAI' }</Text>
            <Text fontSize="12px" color="gray.500">{ `${ nbsp }($${ item.tokenBalanceUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.tokensAmount && (
          <HStack spacing="0">
            <Icon as={ TokensIcon } marginRight="10px" w="17px" h="16px"/>
            <Text fontSize="12px">{ item.tokensAmount + ' tokens' }</Text>
            <Text fontSize="12px" color="gray.500">{ `${ nbsp }($${ item.tokensUSD } USD)` }</Text>
          </HStack>
        ) }
        { item.totalUSD && (
          <HStack spacing="0">
            <Icon as={ WalletIcon } marginRight="10px" w="16px" h="16px"/>
            <Text fontSize="12px">{ `Total balance:${ nbsp }` }</Text>
            <Link fontSize="12px" href="#" color="blue.500">{ `$${ item.totalUSD } USD` }</Link>
          </HStack>
        ) }
      </VStack>
    </HStack>
  )
}

export default WatchListAddressItem;
