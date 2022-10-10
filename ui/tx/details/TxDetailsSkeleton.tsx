import { Grid, GridItem, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

const SkeletonRow = ({ w = '100%' }: { w?: string }) => (
  <>
    <GridItem display="flex" columnGap={ 2 } w={{ base: '50%', lg: 'auto' }} _notFirst={{ mt: { base: 3, lg: 0 } }}>
      <SkeletonCircle h={ 5 } w={ 5 }/>
      <Skeleton flexGrow={ 1 } h={ 5 } borderRadius="full"/>
    </GridItem>
    <GridItem pl={{ base: 7, lg: 0 }}>
      <Skeleton h={ 5 } borderRadius="full" w={{ base: '100%', lg: w }}/>
    </GridItem>
  </>
);

const TxDetailsSkeleton = () => {
  const sectionGap = <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>;

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 5, lg: 7 }} templateColumns={{ base: '1fr', lg: '210px 1fr' }} maxW="1000px">
      <SkeletonRow/>
      <SkeletonRow w="20%"/>
      <SkeletonRow w="50%"/>
      <SkeletonRow/>
      <SkeletonRow w="70%"/>
      <SkeletonRow w="70%"/>
      { sectionGap }
      <SkeletonRow w="40%"/>
      <SkeletonRow w="40%"/>
      <SkeletonRow w="40%"/>
      <SkeletonRow w="40%"/>
      <SkeletonRow w="40%"/>
      { sectionGap }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Skeleton h={ 5 } borderRadius="full" w="100px"/>
      </GridItem>
    </Grid>
  );
};

export default TxDetailsSkeleton;
