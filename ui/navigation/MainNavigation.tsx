import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import MainNavLink from './MainNavLink';
import BlocksIcon from '../../icons/block.svg'
import TransactionsIcon from '../../icons/transactions.svg'
import TokensIcon from '../../icons/token.svg'
import AppsIcon from '../../icons/apps.svg';
import BlockscoutIcon from '../../icons/blockscout.svg';

const navItems = [
  { text: 'Blocks', pathname: '/blocks', icon: BlocksIcon },
  { text: 'Transactions', pathname: '/transactions', icon: TransactionsIcon },
  { text: 'Tokens', pathname: '/tokens', icon: TokensIcon },
  { text: 'Apps', pathname: '/apps', icon: AppsIcon },
  { text: 'Blockscout', pathname: '/blockscout', icon: BlockscoutIcon },
]

const MainNavigation = () => {
  return (
    <Box as="nav">
      <VStack as="ul" spacing="2">
        { navItems.map((item) => <MainNavLink key={ item.text } { ...item }/>) }
      </VStack>
    </Box>
  )
}

export default MainNavigation;
