// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import { CONTENT_MAX_WIDTH } from 'client/shell/layout/utils';

import NetworkLogo from 'client/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'client/slices/chain/TestnetBadge';

import UserProfileDesktop from 'client/features/account/components/user-profile/UserProfileDesktop';
import useIsAuth from 'client/features/account/hooks/useIsAuth';
import RewardsButton from 'client/features/rewards/components/RewardsButton';
import RollupStageBadge from 'client/features/rollup/common/components/RollupStageBadge';

import config from 'configs/app';

import NavigationPromoBanner from '../promo-banner/NavigationPromoBanner';
import useNavItems, { isGroupItem } from '../useNavItems';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const accountFeature = config.features.account;

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

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
          <UserProfileDesktop buttonSize="sm"/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
