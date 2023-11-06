import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import NftEntity from './NftEntity';

const iconSizes = [ 'md', 'lg' ];
const hash = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon sizes', () => {
  iconSizes.forEach((size) => {
    test(size, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <NftEntity
            hash={ hash }
            id={ 1042 }
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
      <NftEntity
        hash={ hash }
        id={ 1042 }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('long id', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <NftEntity
        hash={ hash }
        id={ 1794350723452223 }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <NftEntity
        hash={ hash }
        id={ 1042 }
        p={ 3 }
        borderWidth="1px"
        borderColor="blue.700"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
