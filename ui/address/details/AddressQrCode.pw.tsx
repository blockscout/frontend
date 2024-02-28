import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import TestApp from 'playwright/TestApp';

import AddressQrCode from './AddressQrCode';

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <AddressQrCode address={ addressMock.withoutName }/>
    </TestApp>,
  );
  await page.getByRole('button', { name: /qr code/i }).click();

  await expect(page).toHaveScreenshot();
});
