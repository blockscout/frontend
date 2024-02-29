import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import BlobDataType from './BlobDataType';

test.use({ viewport: { width: 100, height: 50 } });

test('image data', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlobDataType data="0x89504E470D0A1A0A0000000D494844520000003C0000003C0403"/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('raw data', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlobDataType data="0x010203040506"/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});
