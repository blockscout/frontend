import React from 'react';

import { expect, test, devices } from 'playwright/lib';

import * as mocks from './mocks';
import TagSubmitionResult from './TagSubmitionResult';

test('all success result view +@mobile', async({ render }) => {
  const component = await render(<TagSubmitionResult data={ mocks.allSuccessResponses }/>);
  await expect(component).toHaveScreenshot();
});

test('result with errors view', async({ render }) => {
  const component = await render(<TagSubmitionResult data={ mocks.mixedResponses }/>);
  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('result with errors view', async({ render }) => {
    const component = await render(<TagSubmitionResult data={ mocks.mixedResponses }/>);
    await expect(component).toHaveScreenshot();
  });
});
