import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { link } from 'lib/link/link';
import type { RouteName } from 'lib/link/routes';

export interface RoutedTab {
  // for simplicity we use routeName as an id
  // if we migrate to non-Next.js router that should be revised
  // id: string;
  routeName: RouteName;
  title: string;
  component: React.ReactNode;
}

interface Props {
  tabs: Array<RoutedTab>;
  defaultActiveTab: RoutedTab['routeName'];
}

const RoutedTabs = ({ tabs, defaultActiveTab }: Props) => {
  const [ , setActiveTab ] = React.useState<RoutedTab['routeName']>(defaultActiveTab);
  const router = useRouter();

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = tabs[index];
    setActiveTab(nextTab.routeName);
    const newUrl = link(nextTab.routeName, router.query);
    router.push(newUrl, undefined, { shallow: true });
  }, [ tabs, router ]);

  const defaultIndex = tabs.map(({ routeName }) => routeName).indexOf(defaultActiveTab);

  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } defaultIndex={ defaultIndex }>
      <TabList marginBottom={{ base: 6, lg: 8 }} flexWrap="wrap">
        { tabs.map((tab) => <Tab key={ tab.routeName }>{ tab.title }</Tab>) }
      </TabList>
      <TabPanels>
        { tabs.map((tab) => <TabPanel padding={ 0 } key={ tab.routeName }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(RoutedTabs);
