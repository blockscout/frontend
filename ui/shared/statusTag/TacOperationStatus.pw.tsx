import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { test, expect } from 'playwright/lib';

import TacOperationStatus from './TacOperationStatus';

const STATUSES: Array<tac.OperationType> = [
  // TODO @tom2drum remove "as" once the type is fixed
  'TON_TAC_TON' as tac.OperationType,
  'TAC_TON' as tac.OperationType,
  'TON_TAC' as tac.OperationType,
  'ERROR' as tac.OperationType,
  'PENDING' as tac.OperationType,
];

test.use({ viewport: { width: 100, height: 50 } });

STATUSES.forEach((status) => {
  test(`${ status }`, async({ render }) => {
    const component = await render(<TacOperationStatus status={ status }/>);
    await expect(component).toHaveScreenshot();
  });
});
