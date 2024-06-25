import React from 'react';

import type { MarketplaceAppWithSecurityReport } from 'types/client/marketplace';

import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import { test, expect, devices } from 'playwright/lib';

import MarketplaceAppModal from './MarketplaceAppModal';

const props = {
  onClose: () => {},
  onFavoriteClick: () => {},
  showContractList: () => {},
  data: {
    ...appsMock[0],
    securityReport: securityReportsMock[0].chainsData['1'],
  } as MarketplaceAppWithSecurityReport,
  isFavorite: false,
};

const testFn: Parameters<typeof test>[1] = async({ render, page, mockAssetResponse }) => {
  await mockAssetResponse(appsMock[0].logo, './playwright/mocks/image_s.jpg');
  await render(<MarketplaceAppModal { ...props }/>);
  await expect(page).toHaveScreenshot();
};

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', testFn);
});
