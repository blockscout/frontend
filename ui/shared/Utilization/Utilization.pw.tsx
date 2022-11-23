import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import Utilization from './Utilization';

test.use({ viewport: { width: 100, height: 50 } });

test('green color scheme in light mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Utilization value={ 0.423 }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('green color scheme in dark mode', async({ mount }) => {
  const component = await mount(
    <TestApp colorMode="dark">
      <Utilization value={ 0.423 }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('gray color scheme in light mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Utilization value={ 0.423 } colorScheme="gray"/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('gray color scheme in dark mode', async({ mount }) => {
  const component = await mount(
    <TestApp colorMode="dark">
      <Utilization value={ 0.423 } colorScheme="gray"/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});
