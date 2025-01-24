import { chakra } from '@chakra-ui/react';
import { debounce } from 'es-toolkit';
import React, { useEffect, useRef, useState } from 'react';

import type { TabItem } from './types';

import isBrowser from 'lib/isBrowser';
import type { TabsProps } from 'toolkit/chakra/tabs';
import { TabsContent, TabsRoot } from 'toolkit/chakra/tabs';

import AdaptiveTabsList from './AdaptiveTabsList';
import { getTabValue, menuButton } from './utils';

export interface Props extends TabsProps {
  tabs: Array<TabItem>;
  lazyBehavior?: LazyMode;
  tabListProps?: ChakraProps | (({ isSticky, activeTabIndex }: { isSticky: boolean; activeTabIndex: number }) => ChakraProps);
  rightSlot?: React.ReactNode;
  rightSlotProps?: ChakraProps;
  leftSlot?: React.ReactNode;
  leftSlotProps?: ChakraProps;
  stickyEnabled?: boolean;
  onTabChange?: (value: string) => void;
  defaultTab?: string;
  isLoading?: boolean;
  className?: string;
}

// TODO @tom2drum remove this component
const TabsWithScroll = ({
  tabs,
  lazyBehavior,
  tabListProps,
  rightSlot,
  rightSlotProps,
  leftSlot,
  leftSlotProps,
  stickyEnabled,
  onTabChange,
  defaultTab,
  isLoading,
  className,
  ...themeProps
}: Props) => {
  const [ activeTab, setActiveTab ] = useState<string>(defaultTab || getTabValue(tabs[0]));
  const [ screenWidth, setScreenWidth ] = React.useState(isBrowser() ? window.innerWidth : 0);

  const tabsRef = useRef<HTMLDivElement>(null);

  const tabsList = React.useMemo(() => {
    return [ ...tabs, menuButton ];
  }, [ tabs ]);

  const handleTabChange = React.useCallback(({ value }: { value: string }) => {
    if (isLoading) {
      return;
    }
    onTabChange ? onTabChange(value) : setActiveTab(value);
  }, [ isLoading, onTabChange ]);

  useEffect(() => {
    if (defaultTab !== undefined) {
      setActiveTab(defaultTab);
    }
  }, [ defaultTab ]);

  React.useEffect(() => {
    const resizeHandler = debounce(() => {
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
    <TabsRoot
      className={ className }
      variant={ themeProps.variant }
      // colorScheme={ themeProps.colorScheme || 'blue' }
      lazyMount
      unmountOnExit
      onValueChange={ handleTabChange }
      value={ activeTab }
      position="relative"
      size={ themeProps.size }
      ref={ tabsRef }

    >
      <AdaptiveTabsList
        // the easiest and most readable way to achieve correct tab's cut recalculation when
        //    - screen is resized or
        //    - tabs list is changed when API data is loaded
        // is to do full re-render of the tabs list
        // so we use screenWidth + tabIds as a key for the TabsList component
        key={ isLoading + '_' + screenWidth + '_' + tabsList.map((tab) => tab.id).join(':') }
        tabs={ tabs }
        tabListProps={ tabListProps }
        leftSlot={ leftSlot }
        leftSlotProps={ leftSlotProps }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlotProps }
        stickyEnabled={ stickyEnabled }
        activeTab={ activeTab }
        onItemClick={ handleTabChange }
        themeProps={ themeProps }
        isLoading={ isLoading }
      />
      { tabsList.map((tab) => (
        <TabsContent padding={ 0 } key={ getTabValue(tab) } value={ getTabValue(tab) }>
          { tab.component }
        </TabsContent>
      )) }
    </TabsRoot>
  );
};

export default React.memo(chakra(TabsWithScroll));
