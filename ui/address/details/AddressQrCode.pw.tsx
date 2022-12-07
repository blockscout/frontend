import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import AddressQrCode from './AddressQrCode';

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <AddressQrCode hash="0x363574E6C5C71c343d7348093D84320c76d5Dd29"/>
    </TestApp>,
  );
  await page.getByRole('button', { name: /qr code/i }).click();

  await expect(page).toHaveScreenshot();
});
