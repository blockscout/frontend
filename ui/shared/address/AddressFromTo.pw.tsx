import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import AddressFromTo from './AddressFromTo';

test.use({ viewport: configs.viewport.mobile });

test('outgoing txn', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressFromTo
        from={ addressMock.withoutName }
        to={{ ...addressMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
        current={ addressMock.withoutName.hash }
      />
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('incoming txn', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressFromTo
        from={{ ...addressMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
        to={ addressMock.withoutName }
        current={ addressMock.withoutName.hash }
      />
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('compact mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressFromTo
        from={ addressMock.withoutName }
        to={{ ...addressMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
        mode="compact"
      />
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('loading state', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressFromTo
        from={ addressMock.withoutName }
        to={{ ...addressMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
        isLoading
      />
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});
