import type { LazyMode } from '@chakra-ui/lazy-utils';
import type { ChakraProps, ThemingProps } from '@chakra-ui/react';
import {
  Tabs,
  TabPanel,
  TabPanels,
  chakra,
} from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';

import type { TabItem } from './types';

import AdaptiveTabsList from './AdaptiveTabsList';
import { menuButton } from './utils';

export interface Props extends ThemingProps<'Tabs'> {
  tabs: Array<TabItem>;
  lazyBehavior?: LazyMode;
  tabListProps?: ChakraProps | (({ isSticky, activeTabIndex }: { isSticky: boolean; activeTabIndex: number }) => ChakraProps);
  rightSlot?: React.ReactNode;
  rightSlotProps?: ChakraProps;
  stickyEnabled?: boolean;
  onTabChange?: (index: number) => void;
  defaultTabIndex?: number;
  className?: string;
}

const TabsWithScroll = ({
  tabs,
  lazyBehavior,
  tabListProps,
  rightSlot,
  rightSlotProps,
  stickyEnabled,
  onTabChange,
  defaultTabIndex,
  className,
  ...themeProps
}: Props) => {
  const [ activeTabIndex, setActiveTabIndex ] = useState<number>(defaultTabIndex || 0);
  const [ screenWidth, setScreenWidth ] = React.useState(0);

  const tabsRef = useRef<HTMLDivElement>(null);

  const tabsList = React.useMemo(() => {
    return [ ...tabs, menuButton ];
  }, [ tabs ]);

  const handleTabChange = React.useCallback((index: number) => {
    onTabChange ? onTabChange(index) : setActiveTabIndex(index);
  }, [ onTabChange ]);

  useEffect(() => {
    if (defaultTabIndex !== undefined) {
      setActiveTabIndex(defaultTabIndex);
    }
  }, [ defaultTabIndex ]);

  React.useEffect(() => {
    const resizeHandler = _debounce(() => {
      setScreenWidth(window.innerWidth);
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, []);

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
      ref={ tabsRef }
      lazyBehavior={ lazyBehavior }
    >
      <AdaptiveTabsList
        // the easiest and most readable way to achieve correct tab's cut recalculation when screen is resized
        // is to do full re-render of the tabs list
        // so we use screenWidth as a key for the TabsList component
        key={ screenWidth }
        tabs={ tabs }
        tabListProps={ tabListProps }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlotProps }
        stickyEnabled={ stickyEnabled }
        activeTabIndex={ activeTabIndex }
        onItemClick={ handleTabChange }
        themeProps={ themeProps }
      />
      <TabPanels>
        { tabsList.map((tab) => <TabPanel padding={ 0 } key={ tab.id }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(chakra(TabsWithScroll));
