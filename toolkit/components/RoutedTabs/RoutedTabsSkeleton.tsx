import { Flex, chakra, Box } from '@chakra-ui/react';
import React from 'react';

import type { TabItemRegular } from '../AdaptiveTabs/types';

import { Skeleton } from '../../chakra/skeleton';
import type { TabsProps } from '../../chakra/tabs';
import useActiveTabFromQuery from './useActiveTabFromQuery';

const SkeletonTabText = ({ size, title }: { size: TabsProps['size']; title: TabItemRegular['title'] }) => (
  <Skeleton
    borderRadius="base"
    borderWidth={ size === 'sm' ? '2px' : 0 }
    fontWeight={ 600 }
    mx={ size === 'sm' ? 3 : 4 }
    flexShrink={ 0 }
    loading
  >
    { typeof title === 'string' ? title : title() }
  </Skeleton>
);

interface Props {
  className?: string;
  tabs: Array<TabItemRegular>;
  size?: 'sm' | 'md';
}

const RoutedTabsSkeleton = ({ className, tabs, size = 'md' }: Props) => {
  const activeTab = useActiveTabFromQuery(tabs);

  if (tabs.length === 1) {
    return null;
  }

  const tabIndex = activeTab ? tabs.findIndex((tab) => tab.id === activeTab.id) : 0;

  return (
    <Flex className={ className } my={ 8 } alignItems="center" overflow="hidden">
      { tabs.slice(0, tabIndex).map(({ title, id }) => (
        <SkeletonTabText
          key={ id.toString() }
          title={ title }
          size={ size }
        />
      )) }
      { tabs.slice(tabIndex, tabIndex + 1).map(({ title, id }) => (
        <Box
          key={ id.toString() }
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
          py={ size === 'sm' ? 1 : 2 }
          borderRadius="base"
          flexShrink={ 0 }
        >
          <SkeletonTabText
            key={ id.toString() }
            title={ title }
            size={ size }
          />
        </Box>
      )) }
      { tabs.slice(tabIndex + 1).map(({ title, id }) => (
        <SkeletonTabText
          key={ id.toString() }
          title={ title }
          size={ size }
        />
      )) }
    </Flex>
  );
};

export default chakra(RoutedTabsSkeleton);
