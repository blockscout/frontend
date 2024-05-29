import { Flex, Divider, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

import DeFiDropdown from './DeFiDropdown';
import Settings from './settings/Settings';
import TopBarStats from './TopBarStats';

const feature = config.features.deFiDropdown;

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
        { feature.isEnabled && (
          <>
            <DeFiDropdown/>
            <Divider mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
          </>
        ) }
        <Settings/>
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBar);
