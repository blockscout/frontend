import { Flex, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from '../Tabs/types';

interface Props {
  className?: string;
  tabs?: Array<RoutedTab>;
  size?: 'sm' | 'md';
}

const SkeletonTabs = ({ className, tabs, size = 'md' }: Props) => {
  if (tabs) {
    if (tabs.length === 1) {
      return null;
    }

    const paddingHor = size === 'sm' ? 3 : 4;
    const paddingVert = size === 'sm' ? 1 : 2;

    return (
      <Flex className={ className } my={ 8 } alignItems="center">
        { tabs.map(({ title, id }, index) => (
          <Skeleton
            key={ id }
            py={ index === 0 ? paddingVert : 0 }
            px={ index === 0 ? paddingHor : 0 }
            mx={ index === 0 ? 0 : paddingHor }
            borderRadius="base"
            fontWeight={ 600 }
            borderWidth={ size === 'sm' ? '2px' : 0 }
          >
            { typeof title === 'string' ? title : title() }
          </Skeleton>
        )) }
      </Flex>
    );
  }

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
