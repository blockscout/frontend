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
      <Box width="100%" display={{ base: 'block', lg: 'none' }}>
        <HStack spacing={ 2 }>
          <Skeleton w="101px" h="24px"/>
          <Skeleton w="101px" h="24px"/>
        </HStack>
        <Flex
          mt={ 2 }
          alignItems="center"
          width="100%"
          justifyContent="space-between"
          mb={ 6 }
        >
          <Flex mr={ 3 } alignItems="center">
            <Skeleton w="30px" h="30px" mr={ 2 }/>
            <Skeleton w="101px" h="12px"/>
          </Flex>
          <Skeleton w="40px" h="12px"/>
        </Flex>
        <Flex alignItems="center" mb={ 3 }>
          <SkeletonCircle w="30px" h="30px" mr={ 2 }/>
          <Skeleton w="101px" h="12px" mr={ 5 }/>
          <SkeletonCircle w="30px" h="30px" mr={ 2 }/>
          <Skeleton w="101px" h="12px"/>
        </Flex>
        <Skeleton w="123px" h="12px" mb={ 2 } mt={ 3 }/>
        <Skeleton w="123px" h="12px"/>
      </Box>
      <Box display={{ base: 'none', lg: 'grid' }} width="100%" gridTemplateColumns="3fr 2fr 150px" gridGap={ 8 }>
        <Flex w="100%">
          <Skeleton w={ 5 } h={ 5 } mr={ 3 }/>
          <Box w="100%">
            <HStack>
              <Skeleton w="101px" h="24px"/>
              <Skeleton w="101px" h="24px"/>
            </HStack>
            <Flex alignItems="center" mt={ 2 }>
              <Skeleton w="30px" h="30px" mr={ 2 }/>
              <Skeleton w="calc(100% - 100px)" h="20px" mr={ 5 }/>
              <Skeleton w="40px" h="16px"/>
            </Flex>
          </Box>
        </Flex>
        <Box>
          <Flex alignItems="center" mb={ 2 } mt={ 1 }>
            <SkeletonCircle w="24px" h="24px" mr={ 2 }/>
            <Skeleton w="100%" h="16px"/>
          </Flex>
          <Flex alignItems="center">
            <SkeletonCircle w="24px" h="24px" mr={ 2 }/>
            <Skeleton w="100%" h="16px"/>
          </Flex>
        </Box>
        <Box>
          <Skeleton w="123px" h="16px" mb={ 4 } mt={ 2 }/>
          <Skeleton w="123px" h="16px"/>
        </Box>
      </Box>
    </Box>
  );
};

export default LatestTxsItemSkeleton;
