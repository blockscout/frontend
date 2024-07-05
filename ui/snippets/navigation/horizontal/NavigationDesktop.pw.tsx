import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import NavigationDesktop from './NavigationDesktop';

const testWithAuth = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

testWithAuth('base view +@dark-mode', async({ render, mockApiResponse, mockAssetResponse, mockEnvs, page }) => {
  const hooksConfig = {
    router: {
      route: '/blocks',
      pathname: '/blocks',
    },
  };

  await mockApiResponse('user_info', profileMock.base);
  await mockAssetResponse(profileMock.base.avatar, './playwright/mocks/image_s.jpg');
  await mockEnvs([
    ...ENVS_MAP.userOps,
    ...ENVS_MAP.nameService,
    [ 'NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES', '["/blocks","/apps"]' ],
  ]);

  const component = await render(<NavigationDesktop/>, { hooksConfig });
  await component.getByText('Blockchain').hover();
  await expect(page.getByText('Blocks')).toBeVisible();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 450 } });
});

test('with groped items', async({ render, mockEnvs, page }) => {
  const hooksConfig = {
    router: {
      route: '/apps',
      pathname: '/apps',
    },
  };

  await mockEnvs([
    ...ENVS_MAP.optimisticRollup,
    ...ENVS_MAP.userOps,
    ...ENVS_MAP.nameService,
    ...ENVS_MAP.navigationHighlightedRoutes,
    ...ENVS_MAP.noWalletClient,
    ...ENVS_MAP.noAccount,
  ]);

  const component = await render(<NavigationDesktop/>, { hooksConfig });
  await component.getByText('Blockchain').hover();
  await expect(page.getByText('Blocks')).toBeVisible();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 450 } });
});
