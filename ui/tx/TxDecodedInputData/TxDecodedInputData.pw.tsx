import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/txs/decodedInputData';
import RenderWithChakra from 'playwright/RenderWithChakra';
import { DESKTOP, MOBILE } from 'playwright/viewports';

import TxDecodedInputData from './TxDecodedInputData';

test.describe('desktop', () => {
  test.use({ viewport: DESKTOP });

  test('dark color mode', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra colorMode="dark">
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('with indexed fields', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra>
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('without indexed fields', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra>
        <TxDecodedInputData data={ mocks.withoutIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });
});

test.describe('mobile', () => {
  test.use({ viewport: MOBILE });

  test('dark color mode', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra colorMode="dark">
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('with indexed fields', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra>
        <TxDecodedInputData data={ mocks.withIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });

  test('without indexed fields', async({ mount }) => {
    const component = await mount(
      <RenderWithChakra>
        <TxDecodedInputData data={ mocks.withoutIndexedFields }/>
      </RenderWithChakra>,
    );
    await expect(component).toHaveScreenshot();
  });
});
