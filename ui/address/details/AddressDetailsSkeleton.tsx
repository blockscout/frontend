import { Box, Flex, Grid, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

const AddressDetailsSkeleton = () => {
  return (
    <Box>
      <Flex align="center">
        <SkeletonCircle boxSize={ 6 } flexShrink={ 0 }/>
        <Skeleton h={ 6 } w="420px" ml={ 2 }/>
        <Skeleton h={ 6 } w="24px" ml={ 2 } flexShrink={ 0 }/>
        <Skeleton h={ 8 } w="48px" ml={ 3 } flexShrink={ 0 }/>
        <Skeleton h={ 8 } w="48px" ml={ 3 } flexShrink={ 0 }/>
      </Flex>
      <Flex align="center" columnGap={ 4 } mt={ 8 }>
        <Skeleton h={ 6 } w="200px"/>
        <Skeleton h={ 6 } w="80px"/>
      </Flex>
      <Grid columnGap={ 8 } rowGap={{ base: 5, lg: 7 }} templateColumns={{ base: '1fr', lg: '150px 1fr' }} maxW="1000px" mt={ 8 }>
        <DetailsSkeletonRow w="30%"/>
        <DetailsSkeletonRow w="10%"/>
        <DetailsSkeletonRow w="10%"/>
        <DetailsSkeletonRow w="20%"/>
      </Grid>
    </Box>
  );
};

export default AddressDetailsSkeleton;
