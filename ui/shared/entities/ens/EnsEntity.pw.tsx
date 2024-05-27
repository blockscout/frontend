import React from 'react';

import { test, expect } from 'playwright/lib';

import EnsEntity from './EnsEntity';

const name = 'cat.eth';
const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ render }) => {
      const component = await render(
        <EnsEntity
          name={ name }
          iconSize={ size }
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('loading', async({ render }) => {
  const component = await render(
    <EnsEntity
      name={ name }
      isLoading
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with long name', async({ render }) => {
  const component = await render(
    <EnsEntity
      name="kitty.kitty.kitty.cat.eth"
    />,
  );

  await component.getByText(name.slice(0, 4)).hover();

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <EnsEntity
      name={ name }
      p={ 3 }
      borderWidth="1px"
      borderColor="blue.700"
    />,
  );

  await expect(component).toHaveScreenshot();
});
