import type { ChakraProps, ThemingProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import _pickBy from 'lodash/pickBy';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import type { RoutedTab } from './types';

import TabsWithScroll from './TabsWithScroll';

interface Props extends ThemingProps<'Tabs'> {
  tabs: Array<RoutedTab>;
  tabListProps?: ChakraProps | (({ isSticky, activeTabIndex }: { isSticky: boolean; activeTabIndex: number }) => ChakraProps);
  rightSlot?: React.ReactNode;
  stickyEnabled?: boolean;
  className?: string;
}

const RoutedTabs = ({ tabs, tabListProps, rightSlot, stickyEnabled, className, ...themeProps }: Props) => {
  const router = useRouter();

  let tabIndex = 0;
  const tabFromRoute = router.query.tab;
  if (tabFromRoute) {
    tabIndex = tabs.findIndex(({ id, subTabs }) => id === tabFromRoute || subTabs?.some((id) => id === tabFromRoute));
    if (tabIndex < 0) {
      tabIndex = 0;
    }
  }

  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = tabs[index];

    const queryForPathname = _pickBy(router.query, (value, key) => router.pathname.includes(`[${ key }]`));
    router.push(
      { pathname: router.pathname, query: { ...queryForPathname, tab: nextTab.id } },
      undefined,
      { shallow: true },
    );
  }, [ tabs, router ]);

  useEffect(() => {
    if (router.query.scroll_to_tabs) {
      tabsRef?.current?.scrollIntoView(true);
      delete router.query.scroll_to_tabs;
      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { shallow: true },
      );
    }
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TabsWithScroll
      tabs={ tabs }
      tabListProps={ tabListProps }
      rightSlot={ rightSlot }
      stickyEnabled={ stickyEnabled }
      onTabChange={ handleTabChange }
      defaultTabIndex={ tabIndex }
      { ...themeProps }
    />
  );
};

export default React.memo(chakra(RoutedTabs));
