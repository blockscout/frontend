import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ProfileMenuDesktop from './ProfileMenuDesktop';

test('no auth', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      asPath: '/',
      pathname: '/',
    },
  };
  const component = await mount(
    <TestApp>
      <ProfileMenuDesktop/>
    </TestApp>,
    { hooksConfig },
  );

  await component.locator('a').click();
  expect(page.url()).toBe(`${ app.url }/auth/auth0?path=%2F`);
});

test.describe('auth', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      authFixture(context);
      use(context);
    },
  });

  extendedTest('+@dark-mode', async({ mount, page }) => {
    await page.route(buildApiUrl('user_info'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(profileMock.base),
    }));
    await page.route(profileMock.base.avatar, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <ProfileMenuDesktop/>
      </TestApp>,
    );

    await component.getByAltText(/Profile picture/i).click();
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 600 } });
  });
});
