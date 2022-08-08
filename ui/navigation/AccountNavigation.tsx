import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import AccountNavLink from './AccountNavLink';
import WatchlistIcon from 'icons/watchlist.svg';
import PrivateTagIcon from 'icons/privattags.svg';
import PublicTagIcon from 'icons/publictags.svg';
import ApiKeysIcon from 'icons/API.svg';
import ABIIcon from 'icons/ABI.svg';

const navItems = [
  { text: 'Watchlist', pathname: '/watchlist', icon: WatchlistIcon },
  { text: 'Private tags', pathname: '/private-tags', icon: PrivateTagIcon },
  { text: 'Public tags', pathname: '/public-tags', icon: PublicTagIcon },
  { text: 'API keys', pathname: '/api-keys', icon: ApiKeysIcon },
  { text: 'Custom ABI', pathname: '/custom-abi', icon: ABIIcon },
];

const AccountNavigation = () => {
  return (
    <Box as="nav">
      <VStack as="ul" spacing="2">
        { navItems.map((item) => <AccountNavLink key={ item.text } { ...item }/>) }
      </VStack>
    </Box>
  );
};

export default AccountNavigation;
