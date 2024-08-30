import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const NavigationDesktop = () => {
  const { mainNavItems } = useNavItems();

  return (
    <Box borderColor="divider" borderBottomWidth="1px">
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        px={ 6 }
        py={ 2 }
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
      >
        <NetworkLogo isCollapsed={ false } w={{ lg: 'auto' }} maxW="120px"/>
        <TestnetBadge ml={ 3 }/>
        <chakra.nav ml="auto" mr={ config.features.account.isEnabled || config.features.blockchainInteraction.isEnabled ? 8 : 0 }>
          <Flex as="ul" columnGap={ 3 }>
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item }/>;
              } else {
                return <NavLink key={ item.text } item={ item } noIcon py={ 1.5 } w="fit-content"/>;
              }
            }) }
          </Flex>
        </chakra.nav>
        { config.features.account.isEnabled && <ProfileMenuDesktop buttonBoxSize="32px"/> }
        { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop size="sm"/> }
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
