import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TabItemRegular } from './types';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';

import { useIsSticky } from '../..//hooks/useIsSticky';
import { Skeleton } from '../../chakra/skeleton';
import { TabsCounter, TabsList, TabsTrigger } from '../../chakra/tabs';
import AdaptiveTabsMenu from './AdaptiveTabsMenu';
import useAdaptiveTabs from './useAdaptiveTabs';
import useScrollToActiveTab from './useScrollToActiveTab';
import { menuButton, getTabValue } from './utils';

export interface SlotProps extends HTMLChakraProps<'div'> {
  widthAllocation?: 'available' | 'fixed';
}

export interface BaseProps {
  tabs: Array<TabItemRegular>;
  listProps?: HTMLChakraProps<'div'> | (({ isSticky, activeTab }: { isSticky: boolean; activeTab: string }) => HTMLChakraProps<'div'>);
  rightSlot?: React.ReactNode;
  rightSlotProps?: SlotProps;
  leftSlot?: React.ReactNode;
  leftSlotProps?: SlotProps;
  stickyEnabled?: boolean;
  isLoading?: boolean;
}

interface Props extends BaseProps {
  activeTab: string;
}

const HIDDEN_ITEM_STYLES: HTMLChakraProps<'button'> = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

const getItemStyles = (index: number, tabsCut: number | undefined) => {
  if (tabsCut === undefined) {
    return HIDDEN_ITEM_STYLES as never;
  }

  return index < tabsCut ? {} : HIDDEN_ITEM_STYLES as never;
};

const getMenuStyles = (tabsLength: number, tabsCut: number | undefined) => {
  if (tabsCut === undefined) {
    return {
      opacity: 0,
    };
  }

  return tabsCut >= tabsLength ? HIDDEN_ITEM_STYLES : {};
};

const AdaptiveTabsList = (props: Props) => {

  const {
    tabs,
    activeTab,
    listProps,
    rightSlot,
    rightSlotProps,
    leftSlot,
    leftSlotProps,
    stickyEnabled,
    isLoading,
  } = props;

  const scrollDirection = useScrollDirection();
  const isMobile = useIsMobile();

  const tabsList = React.useMemo(() => {
    return [ ...tabs, menuButton ];
  }, [ tabs ]);

  const { tabsCut, tabsRefs, listRef, rightSlotRef, leftSlotRef } = useAdaptiveTabs(tabsList, isMobile);
  const isSticky = useIsSticky(listRef, 5, stickyEnabled);
  const activeTabIndex = tabsList.findIndex((tab) => getTabValue(tab) === activeTab) ?? 0;
  useScrollToActiveTab({ activeTabIndex, listRef, tabsRefs, isMobile, isLoading });

  return (
    <TabsList
      ref={ listRef }
      flexWrap="nowrap"
      alignItems="center"
      whiteSpace="nowrap"
      bgColor={{ _light: 'white', _dark: 'black' }}
      // initially our cut is 0 and we don't want to show the list
      // but we want to keep all items in the tabs row so it won't collapse
      // that's why we only change opacity but not the position itself
      opacity={ tabsCut ? 1 : 0 }
      marginBottom={ 6 }
      mx={{ base: '-12px', lg: 'unset' }}
      px={{ base: '12px', lg: 'unset' }}
      w={{ base: 'calc(100% + 24px)', lg: '100%' }}
      overflowX={{ base: 'auto', lg: 'initial' }}
      overscrollBehaviorX="contain"
      css={{
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: '12px', // mobile page padding
        // hide scrollbar
        '&::-webkit-scrollbar': { /* Chromiums */
          display: 'none',
        },
        '-ms-overflow-style': 'none', /* IE and Edge */
        scrollbarWidth: 'none', /* Firefox */
      }}
      {
        ...(props.stickyEnabled ? {
          position: 'sticky',
          boxShadow: { base: isSticky ? 'md' : 'none', lg: 'none' },
          top: { base: scrollDirection === 'down' ? `0px` : `106px`, lg: 0 },
          zIndex: { base: 'sticky2', lg: 'docked' },
        } : { })
      }
      {
        ...(typeof listProps === 'function' ? listProps({ isSticky, activeTab }) : listProps)
      }
    >
      { leftSlot && (
        <Box
          ref={ leftSlotRef }
          { ...leftSlotProps }
          flexGrow={ leftSlotProps?.widthAllocation === 'available' && tabsCut !== undefined ? 1 : undefined }
        >
          { leftSlot }
        </Box>
      )
      }
      { tabsList.slice(0, isLoading ? 5 : Infinity).map((tab, index) => {
        const value = getTabValue(tab);
        const ref = tabsRefs[index];

        if (tab.id === 'menu') {
          if (isLoading) {
            return null;
          }

          return (
            <AdaptiveTabsMenu
              key="menu"
              ref={ ref }
              tabs={ tabs }
              tabsCut={ tabsCut ?? 0 }
              isActive={ activeTabIndex > 0 && tabsCut !== undefined && tabsCut > 0 && activeTabIndex >= tabsCut }
              { ...getMenuStyles(tabs.length, tabsCut) }
            />
          );
        }

        return (
          <TabsTrigger
            key={ value }
            value={ value }
            ref={ ref }
            scrollSnapAlign="start"
            flexShrink={ 0 }
            { ...getItemStyles(index, tabsCut) }
          >
            { isLoading ? (
              <Skeleton loading>
                { typeof tab.title === 'function' ? tab.title() : tab.title }
                <TabsCounter count={ tab.count }/>
              </Skeleton>
            ) : (
              <>
                { typeof tab.title === 'function' ? tab.title() : tab.title }
                <TabsCounter count={ tab.count }/>
              </>
            ) }
          </TabsTrigger>
        );
      }) }
      {
        rightSlot ? (
          <Box
            ref={ rightSlotRef }
            ml="auto"
            { ...rightSlotProps }
            flexGrow={ rightSlotProps?.widthAllocation === 'available' && tabsCut !== undefined ? 1 : undefined }
          >
            { rightSlot }
          </Box>
        ) :
          null
      }
    </TabsList>
  );
};

export default React.memo(AdaptiveTabsList);
