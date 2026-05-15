import React from 'react';

import * as addressMock from 'client/slices/address/mocks/address';

import * as interopMock from 'client/features/op-interop/mocks/interop';

import { test, expect } from 'playwright/lib';

import AddressEntityInterop from './AddressEntityInterop';

test.use({ viewport: { width: 180, height: 140 } });

test('with chain icon', async({ render, mockAssetResponse }) => {
  await mockAssetResponse('https://example.com/logo.png', './playwright/mocks/image_svg.svg');
  const component = await render(
    <AddressEntityInterop
      address={ addressMock.withoutName }
      chain={ interopMock.chain }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with chain icon stub +@dark-mode', async({ render }) => {
  const component = await render(
    <AddressEntityInterop
      address={ addressMock.withoutName }
      chain={{ ...interopMock.chain, chain_logo: null }}
    />,
  );

  await expect(component).toHaveScreenshot();
});
