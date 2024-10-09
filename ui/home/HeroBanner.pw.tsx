import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import HeroBanner from './HeroBanner';

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

authTest('customization +@dark-mode', async({ render, page, mockEnvs, mockApiResponse, mockAssetResponse }) => {
  const IMAGE_URL = 'https://localhost:3000/my-image.png';

  await mockEnvs([
    // eslint-disable-next-line max-len
    [ 'NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG', `{"background":["lightpink","no-repeat center/cover url(${ IMAGE_URL })"],"text_color":["deepskyblue","white"],"border":["3px solid green","3px dashed yellow"],"button":{"_default":{"background":["deeppink"],"text_color":["white"]},"_selected":{"background":["lime"]}}}` ],
  ]);

  await page.route(IMAGE_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_long.jpg',
    });
  });

  await mockApiResponse('user_info', profileMock.base);
  await mockAssetResponse(profileMock.base.avatar, './playwright/mocks/image_s.jpg');

  const component = await render(<HeroBanner/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
