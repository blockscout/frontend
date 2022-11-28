import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import RenderWithChakra from 'playwright/RenderWithChakra';

import AppError from './AppError';

test.use({ viewport: { width: 900, height: 400 } });

test('status code 404', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <AppError statusCode={ 404 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});

test('status code 500', async({ mount }) => {
  const component = await mount(
    <RenderWithChakra>
      <AppError statusCode={ 500 }/>
    </RenderWithChakra>,
  );
  await expect(component).toHaveScreenshot();
});
