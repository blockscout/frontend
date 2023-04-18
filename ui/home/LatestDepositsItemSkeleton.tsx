import {
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

const LatestTxsItemSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      { isMobile && (
        <>
          <Flex justifyContent="space-between" alignItems="center" mt={ 1 } mb={ 4 }>
            <Skeleton w="120px" h="20px"></Skeleton>
            <Skeleton w="80px" h="20px"></Skeleton>
          </Flex>
          <Skeleton w="100%" h="20px" mb={ 2 }></Skeleton>
          <Skeleton w="100%" h="20px" mb={ 2 }></Skeleton>

        </>
      ) }
      { !isMobile && (
        <>
          <Flex w="100%" mb={ 2 } h="30px" alignItems="center" justifyContent="space-between">
            <Skeleton w="120px" h="20px"></Skeleton>
            <Skeleton w="calc(100% - 120px - 48px)" h="20px"></Skeleton>
          </Flex><Flex w="100%" h="30px" alignItems="center" justifyContent="space-between">
            <Skeleton w="120px" h="20px"></Skeleton>
            <Skeleton w="calc(100% - 120px - 48px)" h="20px"></Skeleton>
          </Flex>
        </>
      ) }
    </Box>
  );
};

export default LatestTxsItemSkeleton;
