import { Flex, Divider, useColorModeValue, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';
import Settings from './settings/Settings';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');

  return (
    <Flex
      py={ 2 }
      px={{ base: 3, lg: 6 }}
      bgColor={ bgColor }
      justifyContent="space-between"
      alignItems="center"
    >
      <TopBarStats/>
      <Flex alignItems="center">
        { config.features.deFiDropdown.isEnabled && (
          <>
            <DeFiDropdown/>
            <Divider mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
          </>
        ) }
        <Settings/>
        { config.UI.navigation.layout === 'horizontal' && Boolean(config.UI.navigation.featuredNetworks) && (
          <Box display={{ base: 'none', lg: 'flex' }}>
            <Divider mx={ 3 } height={ 4 } orientation="vertical"/>
            <NetworkMenu/>
          </Box>
        ) }
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBar);
