import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { solidityscanReport as solidityscanReportMock } from 'mocks/contract/solidityscanReport';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import SolidityscanReport from './SolidityscanReport';

const addressHash = 'hash';
const REPORT_API_URL = buildApiUrl('contract_solidityscan_report', { hash: addressHash });

test('base view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route(REPORT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(solidityscanReportMock),
  }));

  const component = await mount(
    <TestApp>
      <SolidityscanReport hash={ addressHash }/>
    </TestApp>,
  );
  await component.getByLabel('SolidityScan score').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 400, height: 500 } });
});
