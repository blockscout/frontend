import { Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const NumberWidgetSkeleton = () => {
  return (
    <Box
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
      p={ 3 }
      borderRadius={ 12 }
    >
      <Skeleton w="70px" h="10px" mb={ 2 }/>

      <Skeleton w="100px" h="27px"/>
    </Box>
  );
};

export default NumberWidgetSkeleton;
