import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import ContractSubmitAuditForm from './ContractSubmitAuditForm';

test('base view', async({ mount }) => {

  const component = await mount(
    <TestApp>
      { /* eslint-disable-next-line react/jsx-no-bind */ }
      <ContractSubmitAuditForm address="hash" onSuccess={ () => {} }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
