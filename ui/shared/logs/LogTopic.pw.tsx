import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import LogTopic from './LogTopic';

test('address view +@mobile -@default', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LogTopic hex="0x000000000000000000000000d789a607ceac2f0e14867de4eb15b15c9ffb5859" index={ 42 }/>
    </TestApp>,
  );
  await component.locator('select[aria-label="Data type"]').selectOption('address');

  await expect(component).toHaveScreenshot();
});

test('hex view +@mobile -@default', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LogTopic hex="0x000000000000000000000000d789a607ceac2f0e14867de4eb15b15c9ffb5859" index={ 42 }/>
    </TestApp>,
  );
  await component.locator('select[aria-label="Data type"]').selectOption('hex');

  await expect(component).toHaveScreenshot();
});
