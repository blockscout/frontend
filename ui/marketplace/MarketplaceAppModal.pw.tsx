import { test, expect, devices } from '@playwright/experimental-ct-react';
import type { Page, Route } from '@playwright/test';
import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import TestApp from 'playwright/TestApp';

import MarketplaceAppModal from './MarketplaceAppModal';

const props = {
  onClose: () => {},
  onFavoriteClick: () => {},
  data: appsMock[0],
  isFavorite: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testFn = async({ mount, page }: { mount: any; page: Page }) => {
  await page.route(appsMock[0].logo, (route: Route) =>
    route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    }),
  );

  await mount(
    <TestApp>
      <MarketplaceAppModal { ...props }/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot();
};

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', testFn);
});
