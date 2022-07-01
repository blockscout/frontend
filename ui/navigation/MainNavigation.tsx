import React from 'react';
import { VStack } from '@chakra-ui/react';
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
    <VStack spacing="3">
      { navItems.map((item) => <MainNavLink key={ item.text } { ...item }/>) }
    </VStack>
  )
}

export default MainNavigation;
