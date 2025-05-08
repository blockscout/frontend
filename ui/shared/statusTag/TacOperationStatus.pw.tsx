import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { test, expect } from 'playwright/lib';

import TacOperationStatus from './TacOperationStatus';

const STATUSES: Array<tac.OperationType> = [
  'TON_TAC_TON',
  'TAC_TON',
  'TON_TAC',
  'ERROR',
  'PENDING',
];

test.use({ viewport: { width: 100, height: 50 } });

STATUSES.forEach((status) => {
  test(`${ status }`, async({ render }) => {
    const component = await render(<TacOperationStatus status={ status }/>);
    await expect(component).toHaveScreenshot();
  });
});
