import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import StatusTag from './StatusTag';

test('ok status', async({ page, mount }) => {
  await mount(
    <TestApp>
      <StatusTag type="ok" text="Test"/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 75, height: 30 } });
});

test('error status', async({ page, mount }) => {
  await mount(
    <TestApp>
      <StatusTag type="error" text="Test"/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 75, height: 30 } });

});

test('pending status', async({ page, mount }) => {
  await mount(
    <TestApp>
      <StatusTag type="pending" text="Test"/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 75, height: 30 } });
});
