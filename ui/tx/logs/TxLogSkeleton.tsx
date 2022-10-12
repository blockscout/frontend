import { Flex, Grid, GridItem, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const RowHeader = () => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }} _first={{ alignSelf: 'center' }}>
    <Skeleton h={ 6 } borderRadius="full" w="150px"/>
  </GridItem>
);

const TopicRow = () => (
  <Flex columnGap={ 3 }>
    <SkeletonCircle size="6"/>
    <Skeleton h={ 6 } w="70px" borderRadius="full"/>
    <Skeleton h={ 6 } flexGrow={ 1 } borderRadius="full"/>
  </Flex>
);

const TxLogSkeleton = () => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Grid
      gap={{ base: 2, lg: 8 }}
      templateColumns={{ base: '1fr', lg: '200px 1fr' }}
      py={ 8 }
      _notFirst={{
        borderTopWidth: '1px',
        borderTopColor: borderColor,
      }}
      _first={{
        pt: 0,
      }}
    >
      <RowHeader/>
      <GridItem display="flex" alignItems="center">
        <SkeletonCircle size="6"/>
        <Skeleton h={ 6 } flexGrow={ 1 } borderRadius="full" ml={ 2 } mr={ 9 }/>
        <Skeleton h={ 8 } w={ 8 } borderRadius="base"/>
      </GridItem>
      <RowHeader/>
      <GridItem>
        <Skeleton h="150px" w="100%" borderRadius="base"/>
      </GridItem>
      <RowHeader/>
      <GridItem display="flex" flexDir="column" rowGap={ 3 }>
        <TopicRow/>
        <TopicRow/>
        <TopicRow/>
      </GridItem>
      <RowHeader/>
      <GridItem>
        <Skeleton h="60px" w="100%" borderRadius="base"/>
      </GridItem>
    </Grid>
  );
};

export default TxLogSkeleton;
