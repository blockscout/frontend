import { GridItem, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

const DetailsSkeletonRow = ({ w = '100%', maxW }: { w?: string; maxW?: string }) => {
  return (
    <>
      <GridItem display="flex" columnGap={ 2 } w={{ base: '50%', lg: 'auto' }} _notFirst={{ mt: { base: 3, lg: 0 } }}>
        <SkeletonCircle h={ 5 } w={ 5 }/>
        <Skeleton flexGrow={ 1 } h={ 5 } borderRadius="full"/>
      </GridItem>
      <GridItem pl={{ base: 7, lg: 0 }}>
        <Skeleton h={ 5 } borderRadius="full" w={{ base: '100%', lg: w }} maxW={ maxW }/>
      </GridItem>
    </>
  );
};

export default DetailsSkeletonRow;
