import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import TestApp from 'playwright/TestApp';

import AddressEntity from './AddressEntity';

const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 140 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <AddressEntity
            address={ addressMock.withoutName }
            iconSize={ size }
          />
        </TestApp>,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('contract', () => {
  test('unverified', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <AddressEntity
          address={{ ...addressMock.contract, is_verified: false }}
        />
      </TestApp>,
    );

    await component.getByText(/eternal/i).hover();
    await expect(page).toHaveScreenshot();
  });

  test('verified', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AddressEntity
          address={{ ...addressMock.contract, is_verified: true }}
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('loading', () => {
  test('without alias', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AddressEntity
          address={ addressMock.withoutName }
          isLoading
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('with alias', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AddressEntity
          address={ addressMock.withName }
          isLoading
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test('external link', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressEntity
        address={ addressMock.withoutName }
        isExternal
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('no link', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressEntity
        address={ addressMock.withoutName }
        noLink
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressEntity
        address={ addressMock.withoutName }
        truncation="constant"
        p={ 3 }
        borderWidth="1px"
        borderColor="blue.700"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('hover', async({ page, mount }) => {
  const component = await mount(
    <TestApp>
      <AddressEntity
        address={ addressMock.withoutName }
      />
    </TestApp>,
  );

  await component.getByText(addressMock.hash.slice(0, 4)).hover();
  await expect(page).toHaveScreenshot();
});
