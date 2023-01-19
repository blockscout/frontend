import type { ChakraProps, ThemingProps } from '@chakra-ui/react';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { RoutedTab } from './types';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsSticky from 'lib/hooks/useIsSticky';

import RoutedTabsMenu from './RoutedTabsMenu';
import useAdaptiveTabs from './useAdaptiveTabs';

const hiddenItemStyles: StyleProps = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

interface Props extends ThemingProps<'Tabs'> {
  tabs: Array<RoutedTab>;
  tabListProps?: ChakraProps | (({ isSticky }: { isSticky: boolean }) => ChakraProps);
  rightSlot?: React.ReactNode;
  stickyEnabled?: boolean;
  className?: string;
}

const RoutedTabs = ({ tabs, tabListProps, rightSlot, stickyEnabled, className, ...themeProps }: Props) => {
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const [ activeTabIndex, setActiveTabIndex ] = useState<number>(tabs.length + 1);

  const isMobile = useIsMobile();
  const { tabsCut, tabsList, tabsRefs, listRef, rightSlotRef } = useAdaptiveTabs(tabs, isMobile);
  const isSticky = useIsSticky(listRef, 5, stickyEnabled);
  const listBgColor = useColorModeValue('white', 'black');

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = tabs[index];

    router.push(
      { pathname: router.asPath.split('?')[0], query: { tab: nextTab.id } },
      undefined,
      { shallow: true },
    );
  }, [ tabs, router ]);

  useEffect(() => {
    if (router.isReady) {
      let tabIndex = 0;
      const tabFromRoute = router.query.tab;
      if (tabFromRoute) {
        tabIndex = tabs.findIndex(({ id, subTabs }) => id === tabFromRoute || subTabs?.some((id) => id === tabFromRoute));
        if (tabIndex < 0) {
          tabIndex = 0;
        }
      }
      setActiveTabIndex(tabIndex);
    }
  }, [ tabs, router, activeTabIndex ]);

  useEffect(() => {
    if (activeTabIndex < tabs.length && isMobile) {
      window.setTimeout(() => {
        const activeTabRef = tabsRefs[activeTabIndex];
        if (activeTabRef.current && listRef.current) {
          const activeTabRect = activeTabRef.current.getBoundingClientRect();

          listRef.current.scrollTo({
            left: activeTabRect.left + listRef.current.scrollLeft - 16,
            behavior: 'smooth',
          });
        }
      // have to wait until DOM is updated and all styles to tabs is applied
      }, 300);
    }
  // run only when tab index or device type is updated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeTabIndex, isMobile ]);

  if (tabs.length === 1) {
    return <div>{ tabs[0].component }</div>;
  }

  return (
    <Tabs
      className={ className }
      variant={ themeProps.variant || 'soft-rounded' }
      colorScheme={ themeProps.colorScheme || 'blue' }
      isLazy
      onChange={ handleTabChange }
      index={ activeTabIndex }
      position="relative"
      size={ themeProps.size || 'md' }
    >
      <TabList
        marginBottom={{ base: 6, lg: 8 }}
        flexWrap="nowrap"
        whiteSpace="nowrap"
        ref={ listRef }
        overflowY="hidden"
        overflowX={{ base: 'auto', lg: undefined }}
        overscrollBehaviorX="contain"
        css={{
          'scroll-snap-type': 'x mandatory',
          // hide scrollbar
          '&::-webkit-scrollbar': { /* Chromiums */
            display: 'none',
          },
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        }}
        bgColor={ listBgColor }
        transitionProperty="top,box-shadow,background-color,color"
        transitionDuration="normal"
        transitionTimingFunction="ease"
        {
          ...(stickyEnabled ? {
            position: 'sticky',
            boxShadow: { base: isSticky ? 'md' : 'none', lg: 'none' },
            top: { base: scrollDirection === 'down' ? `0px` : `106px`, lg: 0 },
            zIndex: { base: 'sticky2', lg: 'docked' },
          } : { })
        }
        { ...(typeof tabListProps === 'function' ? tabListProps({ isSticky }) : tabListProps) }
      >
        { tabsList.map((tab, index) => {
          if (!tab.id) {
            return (
              <RoutedTabsMenu
                key="menu"
                tabs={ tabs }
                activeTab={ tabs[activeTabIndex] }
                tabsCut={ tabsCut }
                isActive={ activeTabIndex >= tabsCut }
                styles={ tabsCut < tabs.length ?
                  // initially our cut is 0 and we don't want to show the menu button too
                  // but we want to keep it in the tabs row so it won't collapse
                  // that's why we only change opacity but not the position itself
                  { opacity: tabsCut === 0 ? 0 : 1 } :
                  hiddenItemStyles
                }
                onItemClick={ handleTabChange }
                buttonRef={ tabsRefs[index] }
              />
            );
          }

          return (
            <Tab
              key={ tab.id }
              ref={ tabsRefs[index] }
              { ...(index < tabsCut ? {} : hiddenItemStyles) }
              scrollSnapAlign="start"
              flexShrink={ 0 }
            >
              { typeof tab.title === 'function' ? tab.title() : tab.title }
            </Tab>
          );
        }) }
        { rightSlot ? <Box ref={ rightSlotRef } ml="auto" > { rightSlot } </Box> : null }
      </TabList>
      <TabPanels>
        { tabsList.map((tab) => <TabPanel padding={ 0 } key={ tab.id }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(chakra(RoutedTabs));
