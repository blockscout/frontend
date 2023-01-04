import { Flex, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
}

const SkeletonTabs = ({ className }: Props) => {
  return (
    <Flex my={ 8 } className={ className }>
      <Skeleton h={ 6 } my={ 2 } mx={ 4 } w="100px"/>
      <Skeleton h={ 6 } my={ 2 } mx={ 4 } w="120px"/>
      <Skeleton h={ 6 } my={ 2 } mx={ 4 } w="80px" display={{ base: 'none', lg: 'block' }}/>
      <Skeleton h={ 6 } my={ 2 } mx={ 4 } w="100px" display={{ base: 'none', lg: 'block' }}/>
      <Skeleton h={ 6 } my={ 2 } mx={ 4 } w="140px" display={{ base: 'none', lg: 'block' }}/>
    </Flex>
  );
};

export default chakra(SkeletonTabs);
