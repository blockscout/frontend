import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import RenderWithChakra from '../../playwright/RenderWithChakra';
import Utilization from './Utilization';

test.use({ viewport: { width: 100, height: 50 } });

test('Utilization light', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <Utilization value={ 0.1 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});

test('Utilization dark', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra colorMode="dark">
      <Utilization value={ 0.1 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});
