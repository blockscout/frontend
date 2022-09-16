import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const Separator = () => {
  const bgColor = useColorModeValue('gray.700', 'gray.200');
  return (
    <Box width="1px" background={ bgColor } height="20px" mx={ 3 }/>
  );
};

export default Separator;
