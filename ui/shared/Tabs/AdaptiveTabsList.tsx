import type { StyleProps, ThemingProps } from '@chakra-ui/react';
import { Tab, TabList, useColorModeValue } from '@chakra-ui/react';
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
  type?: string;
}

const AdaptiveTabsList = (props: Props) => {
  const scrollDirection = useScrollDirection();
  const listBgColor = useColorModeValue('white', 'blue.1000');
  const color = useColorModeValue('#141414', 'gray.1300');
  const selectedColor = useColorModeValue('#F9FAFB', 'gray.1300');
  const selectedBgColor = useColorModeValue('#141414', 'rgba(36, 43, 55, 1)');
  const bgColor = useColorModeValue('#F4F4F4', 'rgba(255, 255, 255, 0.03)');
  const isMobile = useIsMobile();

  const tabsList = React.useMemo(() => {
    return [ ...props.tabs, menuButton ];
  }, [ props.tabs ]);

  const { tabsCut, tabsRefs, listRef } = useAdaptiveTabs(tabsList, isMobile);
  const isSticky = useIsSticky(listRef, 5, props.stickyEnabled);
  useScrollToActiveTab({
    activeTabIndex: props.activeTabIndex,
    listRef,
    tabsRefs,
    isMobile,
  });

  return (
    <TabList
      // marginBottom={{ base: 6, lg: 8 }}
      mx={{ base: '-16px', lg: 'unset' }}
      px={{
        base: '16px',
        lg: props?.type !== 'parent_tabs' ? '20px' : 'unset',
      }}
      flexWrap="nowrap"
      whiteSpace="nowrap"
      ref={ listRef }
      gap={ 2 }
      overflowX={{ base: 'auto', lg: 'initial' }}
      overscrollBehaviorX="contain"
      css={{
        'scroll-snap-type': 'x mandatory',
        // hide scrollbar
        '&::-webkit-scrollbar': {
          /* Chromiums */ display: 'none',
        },
        '-ms-overflow-style': 'none' /* IE and Edge */,
        'scrollbar-width': 'none' /* Firefox */,
      }}
      bgColor={ listBgColor }
      transitionProperty="top,box-shadow,background-color,color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
      { ...(props.stickyEnabled ?
        {
          // position: 'sticky',
          boxShadow: { base: isSticky ? 'md' : 'none', lg: 'none' },
          top: { base: scrollDirection === 'down' ? `0px` : `106px`, lg: 0 },
          zIndex: { base: 'sticky2', lg: 'docked' },
        } :
        {}) }
      { ...(typeof props.tabListProps === 'function' ?
        props.tabListProps({ isSticky, activeTabIndex: props.activeTabIndex }) :
        props.tabListProps) }
    >
      { tabsList.map((tab, index) => {
        if (!tab.id) {
          return (
            <TabsMenu
              key="menu"
              tabs={ props.tabs }
              activeTab={ props.tabs[props.activeTabIndex] }
              tabsCut={ tabsCut }
              isActive={ props.activeTabIndex >= tabsCut }
              styles={ tabsCut < props.tabs.length ? { opacity: tabsCut === 0 ? 0 : 1 } : hiddenItemStyles }
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
            borderRadius={ props?.type !== 'parent_tabs' ? '25px' : '32px' }
            fontSize="16px"
            paddingX="28px"
            paddingY="16px"
            fontWeight={ props?.type !== 'parent_tabs' ? 'medium' : 'semibold' }
            color={ color }
            background={ bgColor }
            _selected={{ background: selectedBgColor, color: selectedColor }}
            sx={{
              '&:hover span': {
                color: 'inherit',
              },
            }}
          >
            { typeof tab.title === 'function' ? tab.title() : tab.title }
            <TabCounter count={ tab.count }/>
          </Tab>
        );
      }) }
      { /* {props.rightSlot && tabsCut > 0 ? (
        <Box ref={rightSlotRef} ml="auto" {...props.rightSlotProps}>
          {" "}
          {props.rightSlot}{" "}
        </Box>
      ) : null} */ }
    </TabList>
  );
};

export default React.memo(AdaptiveTabsList);
