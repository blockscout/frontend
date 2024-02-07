import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import NetworkExplorers from './NetworkExplorers';

test('base view', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <NetworkExplorers type="tx" pathParam="0x123"/>
    </TestApp>,
  );

  await component.getByText('2').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 300, height: 150 } });
});
