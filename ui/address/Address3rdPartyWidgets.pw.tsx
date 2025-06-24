import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as widgetsMock from 'mocks/address/widgets';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Address3rdPartyWidgets from './Address3rdPartyWidgets';

const ADDRESS_HASH = addressMock.hash;
const hooksConfig = {
  router: {
    query: { hash: ADDRESS_HASH },
  },
};

test('base view +@dark-mode', async({ render, mockApiResponse, mockEnvs, mockConfigResponse, mockAssetResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS', JSON.stringify(widgetsMock.widgets) ],
    [ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-3rd-party-widgets-config.json' ],
  ]);
  await mockConfigResponse(
    'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL',
    'http://localhost:4000/address-3rd-party-widgets-config.json',
    widgetsMock.config,
  );

  await Promise.all(widgetsMock.widgets.map((widget, i) =>
    mockApiResponse('general:address_3rd_party_info', { value: i * 3947 }, { pathParams: { name: widget }, queryParams: { address: ADDRESS_HASH } }),
  ));
  await mockAssetResponse('http://localhost:3000/widget-logo.png', './playwright/mocks/image_s.jpg');

  const component = await render(<Address3rdPartyWidgets showAll addressType="contract"/>, { hooksConfig });

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
      [ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS', JSON.stringify(widgetsMock.widgets) ],
      [ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL', 'http://localhost:4000/address-3rd-party-widgets-config.json' ],
    ]);
    await mockConfigResponse(
      'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL',
      'http://localhost:4000/address-3rd-party-widgets-config.json',
      widgetsMock.config,
    );

    await Promise.all(widgetsMock.widgets.map((widget, i) =>
      mockApiResponse('general:address_3rd_party_info', { value: i * 3947 }, { pathParams: { name: widget }, queryParams: { address: ADDRESS_HASH } }),
    ));
    await mockAssetResponse('http://localhost:3000/widget-logo.png', './playwright/mocks/image_s.jpg');

    const component = await render(<Address3rdPartyWidgets showAll addressType="contract"/>, { hooksConfig });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
