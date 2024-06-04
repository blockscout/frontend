import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

import TestnetBadge from '../TestnetBadge';

const NavigationDesktop = () => {
  const bottomBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      alignItems="center"
      px={ 6 }
      py={ 2 }
      borderBottomWidth="1px"
      borderColor={ bottomBorderColor }
    >
      <NetworkLogo isCollapsed={ false }/>
      <TestnetBadge ml={ 3 }/>
      <Flex ml="auto"/>
      { config.features.account.isEnabled && <ProfileMenuDesktop buttonBoxSize="32px"/> }
      { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop size="sm"/> }
    </Flex>
  );
};

export default React.memo(NavigationDesktop);
