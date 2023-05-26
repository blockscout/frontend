import { Flex, Skeleton, chakra, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from '../Tabs/types';

import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';

interface Props {
  className?: string;
  tabs?: Array<RoutedTab>;
  size?: 'sm' | 'md';
}

const SkeletonTabs = ({ className, tabs, size = 'md' }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const tabIndex = useTabIndexFromQuery(tabs || []);

  if (tabs) {
    if (tabs.length === 1) {
      return null;
    }

    const paddingHor = size === 'sm' ? 3 : 4;
    const paddingVert = size === 'sm' ? 1 : 2;

    return (
      <Flex className={ className } my={ 8 } alignItems="center" overflow="hidden">
        { tabs.slice(0, tabIndex).map(({ title, id }) => (
          <Skeleton
            key={ id }
            mx={ paddingHor }
            borderRadius="base"
            fontWeight={ 600 }
            borderWidth={ size === 'sm' ? '2px' : 0 }
            flexShrink={ 0 }
          >
            { typeof title === 'string' ? title : title() }
          </Skeleton>
        )) }
        { tabs.slice(tabIndex, tabIndex + 1).map(({ title, id }) => (
          <Box key={ id } bgColor={ bgColor } px={ paddingHor } py={ paddingVert } borderRadius="base" flexShrink={ 0 }>
            <Skeleton borderRadius="base" borderWidth={ size === 'sm' ? '2px' : 0 }>
              { typeof title === 'string' ? title : title() }
            </Skeleton>
          </Box>
        )) }
        { tabs.slice(tabIndex + 1).map(({ title, id }) => (
          <Skeleton
            key={ id }
            mx={ paddingHor }
            borderRadius="base"
            fontWeight={ 600 }
            borderWidth={ size === 'sm' ? '2px' : 0 }
            flexShrink={ 0 }
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
