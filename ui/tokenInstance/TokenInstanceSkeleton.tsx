import { Box, Flex, Grid, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';

const TokenInstanceSkeleton = () => {
  return (
    <Box>
      <Skeleton h={ 10 } maxW="400px" w="100%" mb={ 6 }/>
      <Flex align="center">
        <SkeletonCircle boxSize={ 6 } flexShrink={ 0 }/>
        <Skeleton h={ 6 } w={{ base: '100px', lg: '420px' }} ml={ 2 } borderRadius="full"/>
        <Skeleton h={ 8 } w="36px" ml={ 3 } flexShrink={ 0 }/>
        <Skeleton h={ 8 } w="36px" ml={ 3 } flexShrink={ 0 }/>
      </Flex>
      <Flex columnGap={ 6 } rowGap={ 6 } alignItems="flex-start" flexDir={{ base: 'column-reverse', lg: 'row' }} mt={ 8 }>
        <Grid
          columnGap={ 8 }
          rowGap={{ base: 5, lg: 7 }}
          templateColumns={{ base: '1fr', lg: '200px 1fr' }}
          flexGrow={ 1 }
          w="100%"
        >
          <DetailsSkeletonRow w="30%"/>
          <DetailsSkeletonRow w="100%" maxW="450px"/>
          <DetailsSkeletonRow w="100%" maxW="450px"/>
          <DetailsSkeletonRow w="10%"/>
          <DetailsSkeletonRow w="10%"/>
          <DetailsSkeletonRow w="10%"/>
        </Grid>
        <Skeleton h="250px" w="250px" flexShrink={ 0 } alignSelf="center"/>
      </Flex>
      <SkeletonTabs/>
    </Box>
  );
};

export default TokenInstanceSkeleton;
