import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import { test, expect } from 'playwright/lib';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = 'https://marketplace-config.json';

test.beforeEach(async({ mockConfigResponse, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
});

test('base view +@mobile +@dark-mode', async({ render }) => {
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

test('with scores +@mobile +@dark-mode', async({ render, mockConfigResponse, mockEnvs, mockFeatures }) => {
  const MARKETPLACE_SECURITY_REPORTS_URL = 'https://marketplace-security-reports.json';
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL ],
  ]);
  await mockFeatures([
    [ 'security_score_exp', true ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, JSON.stringify(securityReportsMock));
  const component = await render(<Marketplace/>);
  await component.getByText('Apps scores').click();

  await expect(component).toHaveScreenshot();
});
