import type { BrowserContext } from '@playwright/test';
import React from 'react';

import config from 'configs/app';
import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { test, expect, devices } from 'playwright/lib';

import ProfileMenuMobile from './ProfileMenuMobile';

test('no auth', async({ render, page }) => {
  const hooksConfig = {
    router: {
      asPath: '/',
      pathname: '/',
    },
  };
  const component = await render(<ProfileMenuMobile/>, { hooksConfig });
  await component.locator('a').click();

  expect(page.url()).toBe(`${ config.app.baseUrl }/auth/auth0?path=%2F`);
});

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

authTest.describe('auth', () => {
  authTest('base view', async({ render, page, mockApiResponse, mockAssetResponse }) => {
    await mockApiResponse('user_info', profileMock.base);
    await mockAssetResponse(profileMock.base.avatar, './playwright/mocks/image_s.jpg');

    const component = await render(<ProfileMenuMobile/>);
    await component.getByAltText(/Profile picture/i).click();

    await expect(page).toHaveScreenshot();
  });
});
