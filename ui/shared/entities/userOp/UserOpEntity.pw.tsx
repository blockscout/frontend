import React from 'react';

import { test, expect } from 'playwright/lib';

import UserOpEntity from './UserOpEntity';

const hash = '0x376db52955d5bce114d0ccea2dcf22289b4eae1b86bcae5a59bb5fdbfef48899';
const iconSizes = [ 'md', 'lg' ] as const;

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ render }) => {
      const component = await render(
        <UserOpEntity
          hash={ hash }
          icon={{ size }}
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('loading', async({ render }) => {
  const component = await render(
    <UserOpEntity
      hash={ hash }
      isLoading
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with copy +@dark-mode', async({ render }) => {
  const component = await render(
    <UserOpEntity
      hash={ hash }
      noCopy={ false }
    />,
  );

  await component.getByText(hash.slice(0, 4)).hover();

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <UserOpEntity
      hash={ hash }
      truncation="constant"
      p={ 3 }
      borderWidth="1px"
      borderColor="blue.700"
    />,
  );

  await expect(component).toHaveScreenshot();
});
