import { Box, chakra, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const RewardsButton = dynamic(() => import('ui/rewards/RewardsButton'), { ssr: false });
const UserProfileDynamic = dynamic(() => import('ui/snippets/user/profile/dynamic/UserProfile'), { ssr: false });
const UserProfileAuth0 = dynamic(() => import('ui/snippets/user/profile/auth0/UserProfileDesktop'), { ssr: false });
const UserWalletDesktop = dynamic(() => import('ui/snippets/user/wallet/UserWalletDesktop'), { ssr: false });

const NavigationDesktop = () => {
  const { mainNavItems } = useNavItems();

  const userProfile = (() => {
    const accountFeature = config.features.account;
    if (accountFeature.isEnabled) {
      switch (accountFeature.authProvider) {
        case 'auth0':
          return <UserProfileAuth0 buttonSize="sm"/>;
        case 'dynamic':
          return <UserProfileDynamic buttonSize="sm"/>;
        default:
          return null;
      }
    }
    if (config.features.blockchainInteraction.isEnabled) {
      return <UserWalletDesktop/>;
    }
  })();

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
        <NetworkLogo/>
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
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          { userProfile }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
