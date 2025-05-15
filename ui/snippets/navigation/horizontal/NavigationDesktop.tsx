import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import RewardsButton from 'ui/rewards/RewardsButton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const NavigationDesktop = () => {
  const { mainNavItems } = useNavItems();

  return (
    <Box borderColor="border.divider" borderBottomWidth="1px">
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        px={ 6 }
        py={ 2 }
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
      >
        <NetworkLogo isCollapsed={ false } w={{ lg: '100%' }} maxW="120px"/>
        <TestnetBadge ml={ 3 }/>
        <RollupStageBadge ml={ 3 }/>
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
        <Flex gap={ 2 }>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          {
            (config.features.account.isEnabled && <UserProfileDesktop buttonSize="sm"/>) ||
            (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonSize="sm"/>)
          }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
