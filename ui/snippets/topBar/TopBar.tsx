import { Flex, Divider, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

import ColorModeSwitch from './ColorModeSwitch';
import SwapButton from './SwapButton';
import TopBarStats from './TopBarStats';

const feature = config.features.swapButton;

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');

  return (
    <Flex
      py={ 2 }
      px={ 6 }
      bgColor={ bgColor }
      justifyContent="space-between"
      alignItems="center"
    >
      <TopBarStats/>
      <Flex alignItems="center">
        { feature.isEnabled && (
          <>
            <SwapButton/>
            <Divider mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
          </>
        ) }
        <ColorModeSwitch/>
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBar);
