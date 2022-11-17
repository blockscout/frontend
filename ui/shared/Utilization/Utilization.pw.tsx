import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import RenderWithChakra from 'playwright/RenderWithChakra';

import Utilization from './Utilization';

test.use({ viewport: { width: 100, height: 50 } });

test('green color scheme in light mode', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <Utilization value={ 0.423 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});

test('green color scheme in dark mode', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra colorMode="dark">
      <Utilization value={ 0.423 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});

test('gray color scheme in light mode', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <Utilization value={ 0.423 } colorScheme="gray"/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});

test('gray color scheme in dark mode', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra colorMode="dark">
      <Utilization value={ 0.423 } colorScheme="gray"/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});
