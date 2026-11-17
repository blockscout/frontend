// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import UserProfileDesktop from 'src/features/account/components/user-profile/UserProfileDesktop';
import RewardsButton from 'src/features/rewards/components/RewardsButton';
import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import config from 'src/config';

import NavigationPromoBanner from '../promo-banner/NavigationPromoBanner';
import useNavItems from '../useNavItems';
import { isGroupItem } from '../utils';
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
