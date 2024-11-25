import React from 'react';

import { test, expect } from 'playwright/lib';

import BlockEntity from './BlockEntity';

const iconSizes = [ 'md', 'lg' ] as const;

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon sizes', () => {
  iconSizes.forEach((size) => {
    test(`${ size }`, async({ render }) => {
      const component = await render(
        <BlockEntity
          number={ 17943507 }
          icon={{ size }}
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('loading', async({ render }) => {
  const component = await render(
    <BlockEntity
      number={ 17943507 }
      isLoading
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('external link +@dark-mode', async({ render }) => {
  const component = await render(
    <BlockEntity
      number={ 17943507 }
      isExternal
    />,
  );

  await component.getByText('17943507').hover();

  await expect(component).toHaveScreenshot();
});

test('long number', async({ render }) => {
  const component = await render(
    <BlockEntity
      number={ 1794350723452223 }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <BlockEntity
      number={ 17943507 }
      p={ 3 }
      borderWidth="1px"
      borderColor="blue.700"
    />,
  );

  await expect(component).toHaveScreenshot();
});
