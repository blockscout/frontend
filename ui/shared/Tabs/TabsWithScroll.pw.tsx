import React from 'react';

import type { TabItem } from './types';

import { test, expect } from 'playwright/lib';

import TabsWithScroll from './TabsWithScroll';

test('with counters', async({ render }) => {
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
  const component = await render(<TabsWithScroll tabs={ tabs }/>);
  await component.getByText('Third tab').hover();
  await expect(component).toHaveScreenshot();
});
