import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import AccountNavLink from './AccountNavLink';

const navItems = [
  { text: 'Watchlist', pathname: '/watchlist' },
  { text: 'Private tags', pathname: '/private-tags' },
  { text: 'Public tags', pathname: '/public-tags' },
  { text: 'API keys', pathname: '/api-keys' },
  { text: 'Custom ABI', pathname: '/custom-abi' },
]

const AccountNav = () => {
  return (
    <VStack alignItems="flex-start" spacing="4">
      <Text
        paddingLeft="16px"
        fontSize="12px"
        lineHeight="20px"
        color="gray.600"
      >
        Watch List & Notes
      </Text>
      <VStack spacing="3">
        { navItems.map((item) => <AccountNavLink key={ item.text } { ...item }/>) }
      </VStack>
    </VStack>
  )
}

export default AccountNav;
