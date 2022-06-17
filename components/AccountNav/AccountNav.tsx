import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import AccountNavLink from './AccountNavLink';
import StarIcon from '../../icons/star.svg'
// тут кривая иконка в макете, потом доделаем
import PrivateTagIcon from '../../icons/privateTag.svg'
import PublicTagIcon from '../../icons/publicTag.svg'
import ApiKeysIcon from '../../icons/apiKeys.svg';
import ABIIcon from '../../icons/ABI.svg';

const navItems = [
  { text: 'Watchlist', pathname: '/watchlist', icon: StarIcon },
  { text: 'Private tags', pathname: '/private-tags', icon: PrivateTagIcon },
  { text: 'Public tags', pathname: '/public-tags', icon: PublicTagIcon },
  { text: 'API keys', pathname: '/api-keys', icon: ApiKeysIcon },
  { text: 'Custom ABI', pathname: '/custom-abi', icon: ABIIcon },
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
