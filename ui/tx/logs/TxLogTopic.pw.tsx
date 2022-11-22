import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import RenderWithChakra from 'playwright/RenderWithChakra';
import { MOBILE } from 'playwright/viewports';

import TxLogTopic from './TxLogTopic';

test.use({ viewport: MOBILE });

test('address view', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <TxLogTopic hex="0x000000000000000000000000d789a607ceac2f0e14867de4eb15b15c9ffb5859" index={ 42 }/>
    </RenderWithChakra>,
  );
  await component.locator('select[aria-label="Data type"]').selectOption('address');

  await expect(component).toHaveScreenshot();
});

test('hex view', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <TxLogTopic hex="0x000000000000000000000000d789a607ceac2f0e14867de4eb15b15c9ffb5859" index={ 42 }/>
    </RenderWithChakra>,
  );
  await component.locator('select[aria-label="Data type"]').selectOption('hex');

  await expect(component).toHaveScreenshot();
});
