import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import AppErrorTooManyRequests from './AppErrorTooManyRequests';

test('default view +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <AppErrorTooManyRequests/>
    </TestApp>,
  );
  await page.waitForResponse('https://www.google.com/recaptcha/api2/**');

  await expect(component).toHaveScreenshot({
    mask: [ page.locator('.recaptcha') ],
    maskColor: configs.maskColor,
  });
});
