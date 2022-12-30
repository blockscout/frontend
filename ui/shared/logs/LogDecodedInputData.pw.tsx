import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/txs/decodedInputData';
import TestApp from 'playwright/TestApp';

import LogDecodedInputData from './LogDecodedInputData';

test('with indexed fields +@mobile +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LogDecodedInputData data={ mocks.withIndexedFields }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});

test('without indexed fields +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LogDecodedInputData data={ mocks.withoutIndexedFields }/>
    </TestApp>,
  );
  await expect(component).toHaveScreenshot();
});
