import React from 'react';

import { test, expect } from 'playwright/lib';

import TxExternalTxs from './TxExternalTxs';

const EXT_TX_HASH = '2uwpB95K9ae8yrpxxVXJ27ivvHXqrmy82jsamgNtdWJrYDGkCHsRwd2LKXubrQUzXMaojGxZmHZ85XVJN8EJ3LW8';
const CONFIG = {
  chain_name: 'Solana',
  chain_logo_url: 'http://example.url',
  explorer_url_template: 'https://scan.io/tx/{hash}',
};

test('base view', async({ page, render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG', JSON.stringify(CONFIG) ],
  ]);
  await mockAssetResponse(CONFIG.chain_logo_url, './playwright/mocks/image_s.jpg');
  await render(<TxExternalTxs data={ Array(13).fill(EXT_TX_HASH) }/>);
  await page.getByText('13 Solana txs').hover();
  const popover = page.locator('.chakra-popover__content');
  await expect(popover).toBeVisible();
  await expect(popover).toHaveScreenshot();
});
