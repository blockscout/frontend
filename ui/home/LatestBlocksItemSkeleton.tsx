import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const LatestBlocksItemSkeleton = () => {
  return (
    <Box
      minWidth={{ base: '100%', lg: '280px' }}
      borderRadius="12px"
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      p={ 6 }
    >
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        <HStack spacing={ 2 }>
          <Skeleton w="30px" h="30px"/>
          <Skeleton w="93px" h="15px"/>
        </HStack>
        <Skeleton w="44px" h="15px"/>
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <GridItem><Skeleton w="30px" h="15px"/></GridItem>
        <GridItem><Skeleton w="93px" h="15px"/></GridItem>
        <GridItem><Skeleton w="30px" h="15px"/></GridItem>
        <GridItem><Skeleton w="93px" h="15px"/></GridItem>
        <GridItem><Skeleton w="30px" h="15px"/></GridItem>
        <GridItem><Skeleton w="93px" h="15px"/></GridItem>
      </Grid>
    </Box>
  );
};

export default LatestBlocksItemSkeleton;
