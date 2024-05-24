import React from 'react';

import config from 'configs/app';
import { test, expect } from 'playwright/lib';

import DefaultView from './specs/DefaultView';
import LongNameAndManyTags from './specs/LongNameAndManyTags';
import WithTextAd from './specs/WithTextAd';

test.beforeEach(async({ mockTextAd, mockAssetResponse }) => {
  await mockTextAd();
  await mockAssetResponse(config.UI.sidebar.logo.default as string, './playwright/mocks/image_s.jpg');
});

test('default view +@mobile', async({ render }) => {
  const component = await render(<DefaultView/>);
  await expect(component).toHaveScreenshot();
});

test('with text ad +@mobile', async({ render }) => {
  const component = await render(<WithTextAd/>);
  await expect(component).toHaveScreenshot();
});

test('with long name and many tags +@mobile', async({ render }) => {
  const component = await render(<LongNameAndManyTags/>);
  await expect(component).toHaveScreenshot();
});
