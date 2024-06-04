import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const NavigationDesktopHorizontal = () => {
  const bottomBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  return (
    <Box
      display={{ base: 'none', lg: 'flex' }}
      px={ 6 }
      py={ 2 }
      borderBottomWidth="1px"
      borderColor={ bottomBorderColor }>
        NAVIGATION
    </Box>
  );
};

export default React.memo(NavigationDesktopHorizontal);
