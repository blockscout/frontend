import { Skeleton, Flex } from '@chakra-ui/react';
import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

const TxsInternalsSkeletonDesktop = ({ isPending }: {isPending?: boolean}) => {
  return (
    <>
      { !isPending && <Skeleton h={ 6 } w="100%" mb={ 12 }/> }
      <Flex columnGap={ 3 } h={ 8 } mb={ 6 }>
        <Skeleton w="78px"/>
        <Skeleton w="360px"/>
      </Flex>
      <SkeletonTable columns={ [ '32px', '20%', '18%', '15%', '11%', '292px', '18%', '18%' ] }/>
    </>
  );
};

export default TxsInternalsSkeletonDesktop;
