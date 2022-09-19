import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from './types';

import { link } from 'lib/link/link';

import RoutedTabsMenu from './RoutedTabsMenu';
import useAdaptiveTabs from './useAdaptiveTabs';

const hiddenItemStyles: StyleProps = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

interface Props {
  tabs: Array<RoutedTab>;
  defaultActiveTab: RoutedTab['routeName'];
}

const RoutedTabs = ({ tabs, defaultActiveTab }: Props) => {
  const defaultIndex = tabs.findIndex(({ routeName }) => routeName === defaultActiveTab);

  const [ activeTab, setActiveTab ] = React.useState<number>(defaultIndex);
  const { tabsCut, tabsWithMenu, tabsRefs, listRef } = useAdaptiveTabs(tabs);

  const router = useRouter();

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = tabs[index];

    if (nextTab.routeName) {
      const newUrl = link(nextTab.routeName, router.query);
      router.push(newUrl, undefined, { shallow: true });
    }

    setActiveTab(index);
  }, [ tabs, router ]);

  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } index={ activeTab }>
      <TabList marginBottom={{ base: 6, lg: 8 }} flexWrap="nowrap" whiteSpace="nowrap" ref={ listRef }>
        { tabsWithMenu.map((tab, index) => {
          if (!tab.routeName) {
            return (
              <RoutedTabsMenu
                key="menu"
                tabs={ tabs }
                activeTab={ tabs[activeTab] }
                tabsCut={ tabsCut }
                isActive={ activeTab >= tabsCut }
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
              key={ tab.routeName }
              ref={ tabsRefs[index] }
              { ...(index < tabsCut ? {} : hiddenItemStyles) }
            >
              { tab.title }
            </Tab>
          );
        }) }
      </TabList>
      <TabPanels>
        { tabsWithMenu.map((tab) => <TabPanel padding={ 0 } key={ tab.routeName }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(RoutedTabs);
