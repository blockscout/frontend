import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import AccountNavLink from './AccountNavLink';
import { FaRegStar, FaTag, FaUserTag, FaCode, FaMarsDouble } from 'react-icons/fa'

const navItems = [
  { text: 'Watchlist', pathname: '/watchlist', icon: FaRegStar },
  { text: 'Private tags', pathname: '/private-tags', icon: FaUserTag },
  { text: 'Public tags', pathname: '/public-tags', icon: FaTag },
  { text: 'API keys', pathname: '/api-keys', icon: FaMarsDouble },
  { text: 'Custom ABI', pathname: '/custom-abi', icon: FaCode },
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
