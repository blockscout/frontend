import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ColorModeSwitch from './ColorModeSwitch';

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'blackAlpha.900');

  return (
    <Flex
      py={ 2 }
      px={ 6 }
      fontSize="xs"
      bgColor={ bgColor }
    >
      FOO BAR
      <ColorModeSwitch/>
    </Flex>
  );
};

export default React.memo(TopBar);
