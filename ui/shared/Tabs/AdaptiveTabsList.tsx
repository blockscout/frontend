import type { StyleProps, ThemingProps } from '@chakra-ui/react';
import { Box, Skeleton, Tab, TabList, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsSticky from 'lib/hooks/useIsSticky';

import TabCounter from './TabCounter';
import TabsMenu from './TabsMenu';
import type { Props as TabsProps } from './TabsWithScroll';
import useAdaptiveTabs from './useAdaptiveTabs';
import useScrollToActiveTab from './useScrollToActiveTab';
import { menuButton } from './utils';

const hiddenItemStyles: StyleProps = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

interface Props extends TabsProps {
  activeTabIndex: number;
  onItemClick: (index: number) => void;
  themeProps: ThemingProps<'Tabs'>;
  isLoading?: boolean;
}

const AdaptiveTabsList = (props: Props) => {

  const scrollDirection = useScrollDirection();
  const listBgColor = useColorModeValue('white', 'black');
  const isMobile = useIsMobile();

  const tabsList = React.useMemo(() => {
    return [ ...props.tabs, menuButton ];
  }, [ props.tabs ]);

  const { tabsCut, tabsRefs, listRef, rightSlotRef } = useAdaptiveTabs(tabsList, isMobile);
  const isSticky = useIsSticky(listRef, 5, props.stickyEnabled);
  useScrollToActiveTab({ activeTabIndex: props.activeTabIndex, listRef, tabsRefs, isMobile, isLoading: props.isLoading });

  return (
    <TabList
      marginBottom={ 6 }
      mx={{ base: '-12px', lg: 'unset' }}
      px={{ base: '12px', lg: 'unset' }}
      flexWrap="nowrap"
      alignItems="center"
      whiteSpace="nowrap"
      ref={ listRef }
      overflowX={{ base: 'auto', lg: 'initial' }}
      overscrollBehaviorX="contain"
      css={{
        'scroll-snap-type': 'x mandatory',
        'scroll-padding-inline': '12px', // mobile page padding
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
        ...(props.stickyEnabled ? {
          position: 'sticky',
          boxShadow: { base: isSticky ? 'md' : 'none', lg: 'none' },
          top: { base: scrollDirection === 'down' ? `0px` : `106px`, lg: 0 },
          zIndex: { base: 'sticky2', lg: 'docked' },
        } : { })
      }
      {
        ...(typeof props.tabListProps === 'function' ?
          props.tabListProps({ isSticky, activeTabIndex: props.activeTabIndex }) :
          props.tabListProps)
      }
    >
      { tabsList.slice(0, props.isLoading ? 5 : Infinity).map((tab, index) => {
        if (!tab.id) {
          if (props.isLoading) {
            return null;
          }

          return (
            <TabsMenu
              key="menu"
              tabs={ props.tabs }
              activeTab={ props.tabs[props.activeTabIndex] }
              tabsCut={ tabsCut }
              isActive={ props.activeTabIndex >= tabsCut }
              styles={ tabsCut < props.tabs.length ?
              // initially our cut is 0 and we don't want to show the menu button too
              // but we want to keep it in the tabs row so it won't collapse
              // that's why we only change opacity but not the position itself
                { opacity: tabsCut === 0 ? 0 : 1 } :
                hiddenItemStyles
              }
              onItemClick={ props.onItemClick }
              buttonRef={ tabsRefs[index] }
              size={ props.themeProps.size || 'md' }
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
            sx={{
              '&:hover span': {
                color: 'inherit',
              },
            }}
            { ...(index === props.activeTabIndex ? { 'data-selected': true } : {}) }
          >
            <Skeleton isLoaded={ !props.isLoading }>
              { typeof tab.title === 'function' ? tab.title() : tab.title }
              <TabCounter count={ tab.count }/>
            </Skeleton>
          </Tab>
        );
      }) }
      {
        props.rightSlot && tabsCut > 0 ?
          <Box ref={ rightSlotRef } ml="auto" { ...props.rightSlotProps }> { props.rightSlot } </Box> :
          null
      }
    </TabList>
  );
};

export default React.memo(AdaptiveTabsList);
