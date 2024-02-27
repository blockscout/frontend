import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import HeaderDesktop from './HeaderDesktop';

test('default view +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <HeaderDesktop/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
