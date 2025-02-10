import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TxExternalTxs from './TxExternalTxs';

const EXT_TX_HASH = '2uwpB95K9ae8yrpxxVXJ27ivvHXqrmy82jsamgNtdWJrYDGkCHsRwd2LKXubrQUzXMaojGxZmHZ85XVJN8EJ3LW8';

test('base view', async({ page, render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.externalTxs);
  await mockAssetResponse('http://example.url', './playwright/mocks/image_s.jpg');
  await render(<TxExternalTxs data={ Array(13).fill(EXT_TX_HASH) }/>);
  await page.getByText('13 Solana txns').hover();
  const popover = page.locator('.chakra-popover__content');
  await expect(popover).toBeVisible();
  await expect(popover).toHaveScreenshot();
});
