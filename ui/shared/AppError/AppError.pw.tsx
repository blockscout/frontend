import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import AppError from './AppError';

test('status code 404', async({ mount }) => {
  const error = { message: 'Not found', cause: { status: 404 } } as Error;
  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('status code 422', async({ mount }) => {
  const error = { message: 'Unprocessable entry', cause: { status: 422 } } as Error;
  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('status code 500', async({ mount }) => {
  const error = { message: 'Unknown error', cause: { status: 500 } } as Error;
  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('invalid tx hash', async({ mount }) => {
  const error = { message: 'Invalid tx hash', cause: { status: 422, resource: 'tx' } } as Error;
  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('block lost consensus', async({ mount }) => {
  const error = {
    message: 'Not found',
    cause: { payload: { message: 'Block lost consensus', hash: 'hash' } },
  } as Error;
  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('too many requests +@mobile', async({ mount, page }) => {
  const error = {
    message: 'Too many requests',
    cause: { status: 429 },
  } as Error;

  const component = await mount(
    <TestApp>
      <AppError error={ error }/>
    </TestApp>,
  );
  await page.waitForResponse('https://www.google.com/recaptcha/api2/**');

  await expect(component).toHaveScreenshot({
    mask: [ page.locator('.recaptcha') ],
    maskColor: configs.maskColor,
  });
});
