import { Grid, GridItem, Skeleton } from '@chakra-ui/react';
import React from 'react';

import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

const TxDetailsSkeleton = () => {
  const sectionGap = <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>;

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 5, lg: 7 }} templateColumns={{ base: '1fr', lg: '210px 1fr' }} maxW="1000px">
      <DetailsSkeletonRow/>
      <DetailsSkeletonRow w="20%"/>
      <DetailsSkeletonRow w="50%"/>
      <DetailsSkeletonRow/>
      <DetailsSkeletonRow w="70%"/>
      <DetailsSkeletonRow w="70%"/>
      { sectionGap }
      <DetailsSkeletonRow w="40%"/>
      <DetailsSkeletonRow w="40%"/>
      <DetailsSkeletonRow w="40%"/>
      <DetailsSkeletonRow w="40%"/>
      <DetailsSkeletonRow w="40%"/>
      { sectionGap }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Skeleton h={ 5 } borderRadius="full" w="100px"/>
      </GridItem>
    </Grid>
  );
};

export default TxDetailsSkeleton;
