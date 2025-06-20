import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as widgetsMock from 'mocks/address/widgets';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import AddressWidgets from './AddressWidgets';

const ADDRESS_HASH = addressMock.hash;
const hooksConfig = {
  router: {
    query: { hash: ADDRESS_HASH },
  },
};

test('base view +@dark-mode', async({ render, mockApiResponse, mockEnvs, mockConfigResponse, mockAssetResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_ADDRESS_WIDGETS', JSON.stringify(widgetsMock.widgets) ],
    [ 'NEXT_PUBLIC_ADDRESS_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-widgets-config.json' ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_ADDRESS_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-widgets-config.json', widgetsMock.config);

  await Promise.all(widgetsMock.widgets.map((widget, i) =>
    mockApiResponse('general:address_widget', { value: i * 3947 }, { pathParams: { name: widget }, queryParams: { address: ADDRESS_HASH } }),
  ));
  await mockAssetResponse('http://localhost:3000/widget-logo.png', './playwright/mocks/image_s.jpg');

  const component = await render(<AddressWidgets showAll addressType="contract"/>, { hooksConfig });

  await page.hover('.chakra-linkbox');

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, mockApiResponse, mockEnvs, mockConfigResponse, mockAssetResponse, page }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_ADDRESS_WIDGETS', JSON.stringify(widgetsMock.widgets) ],
      [ 'NEXT_PUBLIC_ADDRESS_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-widgets-config.json' ],
    ]);
    await mockConfigResponse('NEXT_PUBLIC_ADDRESS_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-widgets-config.json', widgetsMock.config);

    await Promise.all(widgetsMock.widgets.map((widget, i) =>
      mockApiResponse('general:address_widget', { value: i * 3947 }, { pathParams: { name: widget }, queryParams: { address: ADDRESS_HASH } }),
    ));
    await mockAssetResponse('http://localhost:3000/widget-logo.png', './playwright/mocks/image_s.jpg');

    const component = await render(<AddressWidgets showAll addressType="contract"/>, { hooksConfig });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
