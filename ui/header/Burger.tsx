import { Icon, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import burgerIcon from 'icons/burger.svg';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');

  return (
    <Box padding={ 2 }>
      <Icon
        as={ burgerIcon }
        boxSize={ 6 }
        display="block"
        color={ iconColor }
      />
    </Box>
  );
};

export default Burger;
