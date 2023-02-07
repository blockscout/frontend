import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import AppError from './AppError';

test.use({ viewport: { width: 900, height: 400 } });

test('status code 404', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AppError statusCode={ 404 }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('status code 422', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AppError statusCode={ 422 }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('status code 500', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AppError statusCode={ 500 }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});
