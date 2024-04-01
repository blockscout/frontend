import React from 'react';

import * as profileMock from 'mocks/user/profile';
import authFixture from 'playwright/fixtures/auth';
import { test, expect } from 'playwright/lib';
import * as app from 'playwright/utils/app';

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

  expect(page.url()).toBe(`${ app.url }/auth/auth0?path=%2F`);
});

const authTest = test.extend({
  context: ({ context }, use) => {
    authFixture(context);
    use(context);
  },
});
authTest('auth +@dark-mode', async({ render, page, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('user_info', profileMock.base);
  await mockAssetResponse(profileMock.base.avatar, './playwright/mocks/image_s.jpg');

  const component = await render(<ProfileMenuDesktop/>);
  await component.getByAltText(/Profile picture/i).click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 600 } });
});
