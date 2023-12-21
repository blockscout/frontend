import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxInterpretationResponse } from 'types/api/txInterpretation';

import type { ResourceError } from 'lib/api/resources';
import { txInterpretation as txInterpretationMock } from 'mocks/txs/txInterpretation';
import TestApp from 'playwright/TestApp';

import TxInterpretation from './TxInterpretation';

test('base view +@mobile +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxInterpretation query={{ data: txInterpretationMock } as UseQueryResult<TxInterpretationResponse, ResourceError>}/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
