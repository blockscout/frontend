import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import EnsEntity from './EnsEntity';

const name = 'cat.eth';
const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <EnsEntity
            name={ name }
            iconSize={ size }
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
      <EnsEntity
        name={ name }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with long name', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <EnsEntity
        name="kitty.kitty.kitty.cat.eth"
      />
    </TestApp>,
  );

  await component.getByText(name.slice(0, 4)).hover();

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <EnsEntity
        name={ name }
        p={ 3 }
        borderWidth="1px"
        borderColor="blue.700"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
