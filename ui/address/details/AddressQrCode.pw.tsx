import React from 'react';

import * as addressMock from 'mocks/address/address';
import { test, expect } from 'playwright/lib';

import AddressQrCode from './AddressQrCode';

test('default view +@mobile +@dark-mode', async({ render, page }) => {
  await render(<AddressQrCode address={ addressMock.withoutName }/>);
  await page.getByRole('button', { name: /qr code/i }).click();
  await expect(page).toHaveScreenshot();
});
