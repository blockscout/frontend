import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import AppsIcon from 'icons/apps.svg';
import BlocksIcon from 'icons/block.svg';
import GearIcon from 'icons/gear.svg';
import TokensIcon from 'icons/token.svg';
import TransactionsIcon from 'icons/transactions.svg';

import MainNavLink from './MainNavLink';

const navItems = [
  { text: 'Blocks', pathname: '/blocks', icon: BlocksIcon },
  { text: 'Transactions', pathname: '/transactions', icon: TransactionsIcon },
  { text: 'Tokens', pathname: '/tokens', icon: TokensIcon },
  { text: 'Apps', pathname: '/apps', icon: AppsIcon },
  { text: 'Other', pathname: '/other', icon: GearIcon },
];

const MainNavigation = () => {
  return (
    <Box as="nav" mt={ 14 }>
      <VStack as="ul" spacing="2">
        { navItems.map((item) => <MainNavLink key={ item.text } { ...item }/>) }
      </VStack>
    </Box>
  );
};

export default MainNavigation;
