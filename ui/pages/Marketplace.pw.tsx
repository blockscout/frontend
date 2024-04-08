import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = 'https://marketplace-config.json';
const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL),
  ]),
});

test('base view +@mobile +@dark-mode', async({ render, mockConfigResponse, mockAssetResponse }) => {
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

const MARKETPLACE_SECURITY_REPORTS_URL = 'https://marketplace-security-reports.json';
const securityScoreTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL),
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL),
    storageState.addFeature('security_score_exp', true),
  ]),
});

securityScoreTest('with scores +@mobile +@dark-mode', async({ render, mockConfigResponse, mockAssetResponse }) => {
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, JSON.stringify(securityReportsMock));
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
  const component = await render(<Marketplace/>);
  await component.getByText('Apps scores').click();

  await expect(component).toHaveScreenshot();
});
