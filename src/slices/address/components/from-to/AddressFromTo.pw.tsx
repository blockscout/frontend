import React from 'react';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import AddressFromTo from './AddressFromTo';

test.use({ viewport: pwConfig.viewport.mobile });

test('outgoing txn', async({ render }) => {
  const component = await render(
    <AddressFromTo
      from={ addressParamMock.withoutName }
      to={{ ...addressParamMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
      current={ addressParamMock.withoutName.hash }
    />,
  );
  await expect(component).toHaveScreenshot();
});

test('incoming txn', async({ render }) => {
  const component = await render(
    <AddressFromTo
      from={{ ...addressParamMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
      to={ addressParamMock.withoutName }
      current={ addressParamMock.withoutName.hash }
    />,
  );
  await expect(component).toHaveScreenshot();
});

test('compact mode', async({ render }) => {
  const component = await render(
    <AddressFromTo
      from={ addressParamMock.withoutName }
      to={{ ...addressParamMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
      mode="compact"
    />,
  );
  await expect(component).toHaveScreenshot();
});

test('loading state', async({ render }) => {
  const component = await render(
    <AddressFromTo
      from={ addressParamMock.withoutName }
      to={{ ...addressParamMock.withName, hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' }}
      isLoading
    />,
  );
  await expect(component).toHaveScreenshot();
});
