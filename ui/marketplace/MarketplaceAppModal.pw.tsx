import React from 'react';

import type { MarketplaceAppWithSecurityReport } from 'types/client/marketplace';

import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import type { TestFnArgs } from 'playwright/lib';
import { test, expect, devices } from 'playwright/lib';

import MarketplaceAppModal from './MarketplaceAppModal';

const props = {
  onClose: () => {},
  onFavoriteClick: () => {},
  showContractList: () => {},
  data: {
    ...appsMock[0],
    securityReport: securityReportsMock[0].chainsData['1'],
    rating: {
      recordId: 'test',
      value: 4.3,
    },
  } as MarketplaceAppWithSecurityReport,
  isFavorite: false,
  userRating: undefined,
  rateApp: () => {},
  isRatingSending: false,
  isRatingLoading: false,
  canRate: undefined,
};

const testFn = async({ render, page, mockAssetResponse, mockEnvs }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_API_KEY', 'test' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_BASE_ID', 'test' ],
  ]);
  await mockAssetResponse(appsMock[0].logo, './playwright/mocks/image_s.jpg');
  await render(<MarketplaceAppModal { ...props }/>);
  await page.getByText('Launch app').focus();
  await expect(page).toHaveScreenshot();
};

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', testFn);
});
