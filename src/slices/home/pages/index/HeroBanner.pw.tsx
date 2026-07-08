import type { BrowserContext } from '@playwright/test';
import React from 'react';

import type { HeroBannerConfig } from 'src/slices/home/types/config';

import * as profileMock from 'src/features/account/mocks/user-profile';
import * as rewardsBalanceMock from 'src/features/rewards/mocks/balance';
import * as dailyRewardMock from 'src/features/rewards/mocks/daily-reward';

import { contextWithAuth } from 'playwright/fixtures/auth';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { contextWithRewards } from 'playwright/fixtures/rewards';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import HeroBanner from './HeroBanner';

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
}).extend<{ context: BrowserContext }>({
  context: contextWithRewards,
});

authTest('customization +@dark-mode', async({ render, page, mockEnvs, mockApiResponse }) => {
  const IMAGE_URL = 'https://localhost:3000/my-image.png';
  const HERO_BANNER_CONFIG: HeroBannerConfig = {
    text: 'Duck migration observer',
    background: [ 'lightpink', `no-repeat center/cover url(${ IMAGE_URL })` ],
    text_color: [ 'deepskyblue', 'white' ],
    border: [ '3px solid green', '3px dashed yellow' ],
    search: {
      background: [ '#faebd7', '#ffffe0' ],
      border_width: [ '2px', '2px' ],
      border_color: {
        _empty: [ 'green', 'yellow' ],
        _hover: [ 'blue', 'orange' ],
        _focus: [ 'purple', 'cyan' ],
        _filled: [ 'red', 'lime' ],
      },
    },
    button: {
      _default: { background: [ 'deeppink' ], text_color: [ 'white' ] },
      _selected: { background: [ 'lime' ] },
    },
  };

  await mockEnvs([
    ...ENVS_MAP.rewardsService,
    [ 'NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG', JSON.stringify(HERO_BANNER_CONFIG) ],
  ]);

  await page.route(IMAGE_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_long.jpg',
    });
  });

  await mockApiResponse('core:user_info', profileMock.withEmailAndWallet);
  await mockApiResponse('rewards:user_balances', rewardsBalanceMock.base);
  await mockApiResponse('rewards:user_daily_check', dailyRewardMock.base);

  const component = await render(<HeroBanner/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
