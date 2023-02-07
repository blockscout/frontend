import {
  Box,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import React from 'react';

const LatestTxsItemSkeleton = () => {
  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Flex justifyContent="space-between" width="100%" alignItems="start" flexDirection={{ base: 'column', lg: 'row' }}>
        <Box width="100%">
          <HStack spacing={ 2 }>
            <Skeleton w="101px" h="24px"/>
            <Skeleton w="101px" h="24px"/>
          </HStack>
          <Flex
            mt={ 2 }
            alignItems="center"
            width="100%"
            justifyContent={{ base: 'space-between', lg: 'start' }}
            mb={{ base: 6, lg: 0 }}
          >
            <Flex mr={ 3 } alignItems="center">
              <Skeleton w="30px" h="30px" mr={ 2 }/>
              <Skeleton w="101px" h="12px"/>
            </Flex>
            <Skeleton w="40px" h="12px"/>
          </Flex>
        </Box>
        <Box>
          <Flex alignItems="center" mb={ 3 }>
            <SkeletonCircle w="30px" h="30px" mr={ 2 }/>
            <Skeleton w="101px" h="12px" mr={ 5 }/>
            <SkeletonCircle w="30px" h="30px" mr={ 2 }/>
            <Skeleton w="101px" h="12px"/>
          </Flex>
          <Flex fontSize="sm" mt={ 3 } justifyContent="end" flexDirection={{ base: 'column', lg: 'row' }}>
            <Skeleton w="123px" h="12px" mr={{ base: 0, lg: 9 }} mb={{ base: 2, lg: 0 }}/>
            <Skeleton w="123px" h="12px"/>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default LatestTxsItemSkeleton;
