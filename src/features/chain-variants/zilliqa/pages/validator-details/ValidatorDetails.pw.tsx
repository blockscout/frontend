import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';

import * as validatorsMock from 'src/features/chain-variants/zilliqa/mocks/validators';

import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import ValidatorDetails from './ValidatorDetails';

test('base view +@mobile', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('core:stats', statsMock.base);
  const component = await render(<ValidatorDetails data={ validatorsMock.validatorDetails } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
