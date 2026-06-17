import React from 'react';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { test, expect } from 'playwright/lib';

import AddressQrCode from './AddressQrCode';

test('default view +@mobile +@dark-mode', async({ render, page }) => {
  await render(<AddressQrCode hash={ addressParamMock.hash }/>);
  await page.getByRole('button', { name: /qr code/i }).click();
  await expect(page).toHaveScreenshot();
});
