import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import type { Size } from '../utils';
import TxEntity from './TxEntity';

const hash = '0x376db52955d5bce114d0ccea2dcf22289b4eae1b86bcae5a59bb5fdbfef48899';
const sizes: Array<Size> = [ 'sm', 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('sizes', () => {
  sizes.forEach((size) => {
    test(`size=${ size }`, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <TxEntity
            hash={ hash }
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
      <TxEntity
        hash={ hash }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('external link', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxEntity
        hash={ hash }
        isExternal
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with copy', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxEntity
        hash={ hash }
        withCopy
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxEntity
        hash={ hash }
        truncation="constant"
        p={ 3 }
        borderWidth="1px"
        borderColor="blue.700"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
