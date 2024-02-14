import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import UserOpEntity from './UserOpEntity';

const hash = '0x376db52955d5bce114d0ccea2dcf22289b4eae1b86bcae5a59bb5fdbfef48899';
const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <UserOpEntity
            hash={ hash }
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
      <UserOpEntity
        hash={ hash }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with copy +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <UserOpEntity
        hash={ hash }
        noCopy={ false }
      />
    </TestApp>,
  );

  await component.getByText(hash.slice(0, 4)).hover();

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <UserOpEntity
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
