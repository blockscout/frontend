import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { Box, Link, HStack, VStack, Image, Text, Icon, Tooltip } from '@chakra-ui/react';

import AddressWithDots from '../shared/AddressWithDots';
import CopyToClipboard from '../shared/CopyToClipboard';
import type { TWatchlistItem } from '../../data/watchlist';
import { nbsp } from '../../lib/html-entities';
import TokensIcon from '../../icons/tokens.svg';
import WalletIcon from '../../icons/wallet.svg';

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {

  const image = <Jazzicon diameter={ 24 } seed={ jsNumberForAddress(item.address) }/>
  return (
    <HStack spacing={ 3 } align="top">
      <Box width="24px">{ image }</Box>
      <VStack spacing={ 2 } align="stretch" overflow="hidden" fontWeight={ 500 } color="gray.700">
        <HStack spacing={ 2 } alignContent="center">
          <Link
            href="#"
            color="blue.500"
            overflow="hidden"
            fontWeight={ 600 }
            lineHeight="24px"
            // need theme
            _hover={{ color: 'blue.400' }}
          >
            <Tooltip label={ item.address }>
              <Box overflow="hidden"><AddressWithDots address={ item.address }/></Box>
            </Tooltip>
          </Link>
          <CopyToClipboard text={ item.address }/>
        </HStack>
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
