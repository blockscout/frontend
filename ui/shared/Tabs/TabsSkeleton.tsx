import { Flex, Skeleton, chakra, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from '../Tabs/types';

import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';

type TabSize = 'sm' | 'md';

const SkeletonTabText = ({ size, title }: { size: TabSize; title: RoutedTab['title'] }) => (
  <Skeleton
    borderRadius="base"
    borderWidth={ size === 'sm' ? '2px' : 0 }
    fontWeight={ 600 }
    mx={ size === 'sm' ? 3 : 4 }
    flexShrink={ 0 }
  >
    { typeof title === 'string' ? title : title() }
  </Skeleton>
);

interface Props {
  className?: string;
  tabs: Array<RoutedTab>;
  size?: 'sm' | 'md';
}

const TabsSkeleton = ({ className, tabs, size = 'md' }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const tabIndex = useTabIndexFromQuery(tabs || []);

  if (tabs.length === 1) {
    return null;
  }

  return (
    <Flex className={ className } my={ 8 } alignItems="center" overflow="hidden">
      { tabs.slice(0, tabIndex).map(({ title, id }) => (
        <SkeletonTabText
          key={ id }
          title={ title }
          size={ size }
        />
      )) }
      { tabs.slice(tabIndex, tabIndex + 1).map(({ title, id }) => (
        <Box key={ id } bgColor={ bgColor } py={ size === 'sm' ? 1 : 2 } borderRadius="base" flexShrink={ 0 }>
          <SkeletonTabText
            key={ id }
            title={ title }
            size={ size }
          />
        </Box>
      )) }
      { tabs.slice(tabIndex + 1).map(({ title, id }) => (
        <SkeletonTabText
          key={ id }
          title={ title }
          size={ size }
        />
      )) }
    </Flex>
  );
};

export default chakra(TabsSkeleton);
