import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenInstanceMock from 'mocks/tokens/tokenInstance';
import TestApp from 'playwright/TestApp';

import TokenInstanceMetadata from './TokenInstanceMetadata';

test('base view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenInstanceMetadata data={ tokenInstanceMock.withRichMetadata.metadata }/>
    </TestApp>,
  );

  await component.getByRole('button', { name: /png/i }).click();
  await component.getByRole('button', { name: /primary/i }).click();

  await component.getByRole('button', { name: /secondary/i }).click();
  await component.getByRole('button', { name: /more/i }).click();

  await component.getByRole('button', { name: /webp/i }).click();
  await component.getByRole('button', { name: /attributes/i }).click();
  await component.getByRole('button', { name: /tags/i }).click();

  await expect(component).toHaveScreenshot();
});

test('raw view', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenInstanceMetadata data={ tokenInstanceMock.withRichMetadata.metadata }/>
    </TestApp>,
  );

  await component.locator('select').selectOption('JSON');

  await expect(component).toHaveScreenshot();
});
