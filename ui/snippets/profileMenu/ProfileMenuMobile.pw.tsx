import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ProfileMenuMobile from './ProfileMenuMobile';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('no auth', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ProfileMenuMobile/>
    </TestApp>,
  );

  await component.locator('.identicon').click();
  await expect(page).toHaveScreenshot();
});

test.describe('auth', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      authFixture(context);
      use(context);
    },
  });

  extendedTest('base view', async({ mount, page }) => {
    await page.route(buildApiUrl('user_info'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(profileMock.base),
    }));
    await page.route(profileMock.base.avatar, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <ProfileMenuMobile/>
      </TestApp>,
    );

    await component.getByAltText(/Profile picture/i).click();
    await expect(page).toHaveScreenshot();

    await page.locator('div[aria-label="Toggle color mode"]').click();
    await expect(page).toHaveScreenshot();
  });
});
