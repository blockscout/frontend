import { Box, chakra, Flex, Separator } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import RewardsButton from 'ui/rewards/RewardsButton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';
import UserProfileAuth0 from 'ui/snippets/user/profile/auth0/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const UserProfileDynamic = dynamic(() => import('ui/snippets/user/profile/dynamic/UserProfile'), { ssr: false });

const accountFeature = config.features.account;

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

  const userProfile = (() => {
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

  const accountNavGroup = React.useMemo(() => {
    if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' && isAuth) {
      return {
        text: 'Account',
        subItems: accountNavItems,
      };
    }
  }, [ accountNavItems, isAuth ]);

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
        <chakra.nav ml="auto">
          <Flex as="ul" columnGap={ 2 } alignItems="center">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item }/>;
              } else {
                return <NavLink key={ item.text } item={ item } noIcon py={ 1.5 } w="fit-content"/>;
              }
            }) }
            { accountNavGroup && (
              <>
                <Separator orientation="vertical" mx={ 0 } h={ 4 }/>
                <NavLinkGroup key={ accountNavGroup.text } item={ accountNavGroup }/>
              </>
            ) }
          </Flex>
        </chakra.nav>
        <Flex gap={ 2 } ml={ 8 } _empty={{ display: 'none' }}>
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          { userProfile }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
