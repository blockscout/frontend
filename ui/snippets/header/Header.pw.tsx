import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import Header from './Header';

test('no auth +@mobile', async({ mount, page }) => {
  await mount(
    <TestApp>
      <Header/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('+@mobile', async({ mount, page }) => {
    await mount(
      <TestApp>
        <Header/>
      </TestApp>,
    );

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
  });
});
