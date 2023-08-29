import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { TabItem } from './types';

import TestApp from 'playwright/TestApp';

import TabsWithScroll from './TabsWithScroll';

test('with counters', async({ mount }) => {
  const tabs: Array<TabItem> = [
    {
      id: 'tab1',
      title: 'First tab',
      count: 11,
      component: null,
    },
    {
      id: 'tab2',
      title: 'Second tab',
      count: 0,
      component: null,
    },
    {
      id: 'tab3',
      title: 'Third tab',
      count: 51,
      component: null,
    },
  ];
  const component = await mount(
    <TestApp>
      <TabsWithScroll tabs={ tabs }/>
    </TestApp>,
  );

  await component.getByText('Third tab').hover();

  await expect(component).toHaveScreenshot();
});
