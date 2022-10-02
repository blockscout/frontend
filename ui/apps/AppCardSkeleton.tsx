import { Box, Heading, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

export const AppCardSkeleton = () => {
  return (
    <Box
      borderRadius="md"
      height="100%"
      padding={{ base: 3, sm: '20px' }}
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
    >
      <Box
        display={{ base: 'grid', sm: 'block' }}
        gridTemplateColumns={{ base: '64px 1fr', sm: '1fr' }}
        gridTemplateRows={{ base: '20px 20px auto', sm: 'none' }}
        gridRowGap={{ base: 2, sm: 'none' }}
        gridColumnGap={{ base: 4, sm: 'none' }}
        height="100%"
      >
        <Box
          gridRow={{ base: '1 / 4', sm: 'auto' }}
          marginBottom={ 4 }
          w={{ base: '64px', sm: '96px' }}
          h={{ base: '64px', sm: '96px' }}
        >
          <SkeletonCircle w="100%" h="100%"/>
        </Box>

        <Heading
          gridColumn={{ base: 2, sm: 'auto' }}
          marginBottom={ 2 }
        >
          <Skeleton h={ 4 } w="50%"/>
        </Heading>

        <Box>
          <Skeleton h={ 4 } mb={ 1 }/>
          <Skeleton h={ 4 } mb={ 1 }/>
          <Skeleton h={ 4 } w="50%"/>
        </Box>
      </Box>
    </Box>
  );
};
