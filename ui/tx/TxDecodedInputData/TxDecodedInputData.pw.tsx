import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/txs/decodedInputData';
import TestApp from 'playwright/TestApp';
import { DESKTOP, MOBILE } from 'playwright/viewports';

import TxDecodedInputData from './TxDecodedInputData';

test.describe('desktop', () => {
  test.use({ viewport: DESKTOP });

  test('dark color mode', async({ mount }) => {
    const component = await mount(
      <TestApp colorMode="dark">
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('with indexed fields', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('without indexed fields', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <TxDecodedInputData data={ mocks.withoutIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });
});

test.describe('mobile', () => {
  test.use({ viewport: MOBILE });

  test('dark color mode', async({ mount }) => {
    const component = await mount(
      <TestApp colorMode="dark">
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('with indexed fields', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('without indexed fields', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <TxDecodedInputData data={ mocks.withoutIndexedFields }/>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });
});
