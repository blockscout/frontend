import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txInterpretation as txInterpretationMock } from 'mocks/txs/txInterpretation';
import TestApp from 'playwright/TestApp';

import TxInterpretation from './TxInterpretation';

test('base view +@mobile +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxInterpretation summary={ txInterpretationMock.data.summaries[0] } isLoading={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
