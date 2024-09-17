import { Box } from '@chakra-ui/react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as tokenMock from 'mocks/tokens/tokenInfo';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import CsvExport from './CsvExport';

test('base view +@mobile +@dark-mode', async({ render, page, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { address: addressMock.hash, type: 'transactions', filterType: 'address', filterValue: 'from' },
    },
  };
  await mockApiResponse('address', addressMock.validator, { pathParams: { hash: addressMock.hash } });
  await mockApiResponse('config_csv_export', { limit: 42123 });

  const component = await render(<Box sx={{ '.recaptcha': { w: '304px', h: '78px' } }}><CsvExport/></Box>, { hooksConfig });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator('.recaptcha') ],
    maskColor: pwConfig.maskColor,
  });
});

test('token holders', async({ render, page, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { address: addressMock.hash, type: 'holders' },
    },
  };
  await mockApiResponse('address', addressMock.token, { pathParams: { hash: addressMock.hash } });
  await mockApiResponse('token', tokenMock.tokenInfo, { pathParams: { hash: addressMock.hash } });

  const component = await render(<Box sx={{ '.recaptcha': { w: '304px', h: '78px' } }}><CsvExport/></Box>, { hooksConfig });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator('.recaptcha') ],
    maskColor: pwConfig.maskColor,
  });
});
