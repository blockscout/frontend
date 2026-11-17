import React from 'react';

import * as addressMock from 'src/slices/address/mocks/address';
import { tokenInfoERC721a } from 'src/slices/token/mocks/info';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';
import { MetadataUpdateProvider } from 'src/slices/token/pages/instance/metadata-update-context';

import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import TokenInstanceDetails from './TokenInstanceDetails';

const hash = tokenInfoERC721a.address_hash;

test.beforeEach(async({ mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('core:address', addressMock.contract, { pathParams: { hash } });
  await mockApiResponse('core:token_instance_transfers_count', { transfers_count: 42 }, { pathParams: { id: tokenInstanceMock.unique.id, hash } });
  await mockAssetResponse('http://localhost:3000/nft-marketplace-logo.png', './playwright/mocks/image_s.jpg');
  await mockAssetResponse(tokenInstanceMock.unique.image_url as string, './playwright/mocks/image_md.jpg');
});

test('base view +@dark-mode', async({ render, page }) => {
  const component = await render(
    <MetadataUpdateProvider>
      <TokenInstanceDetails data={{ ...tokenInstanceMock.unique, image_url: null }} token={ tokenInfoERC721a }/>
    </MetadataUpdateProvider>,
  );
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, page }) => {
    const component = await render(
      <MetadataUpdateProvider>
        <TokenInstanceDetails data={{ ...tokenInstanceMock.unique, image_url: null }} token={ tokenInfoERC721a }/>
      </MetadataUpdateProvider>,
    );
    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
