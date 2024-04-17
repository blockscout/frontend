import type { BrowserContext } from '@playwright/test';
import React from 'react';

import config from 'configs/app';
import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { test, expect } from 'playwright/lib';

import ProfileMenuDesktop from './ProfileMenuDesktop';

test('no auth', async({ render, page }) => {
  const hooksConfig = {
    router: {
      asPath: '/',
      pathname: '/',
    },
  };
  const component = await render(<ProfileMenuDesktop/>, { hooksConfig });
  await component.locator('a').click();

  expect(page.url()).toBe(`${ config.app.baseUrl }/auth/auth0?path=%2F`);
});

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});
authTest('auth +@dark-mode', async({ render, page, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('user_info', profileMock.base);
  await mockAssetResponse(profileMock.base.avatar, './playwright/mocks/image_s.jpg');

  const component = await render(<ProfileMenuDesktop/>);
  await component.getByAltText(/Profile picture/i).click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 600 } });
});
