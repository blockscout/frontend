import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import BlockEntity from './BlockEntity';

const sizes = [ 'sm', 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('sizes', () => {
  sizes.forEach((size) => {
    test(`size=${ size }`, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <BlockEntity
            number={ 17943507 }
            size={ size }
          />
        </TestApp>,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('loading', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlockEntity
        number={ 17943507 }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('external link', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlockEntity
        number={ 17943507 }
        isExternal
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('long number', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlockEntity
        number={ 1794350723452223 }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <BlockEntity
        number={ 17943507 }
        p={ 3 }
        borderWidth="1px"
        borderColor="blue.700"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
