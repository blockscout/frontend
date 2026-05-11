import React from 'react';

import * as txMock from 'client/slices/tx/mocks/tx';

import * as txMockCelo from 'client/features/chain-variants/celo/mocks/tx';
import * as txMockStability from 'client/features/chain-variants/stability/mocks/tx';

import { test, expect } from 'playwright/lib';

import TxFee from './TxFee';

test.use({ viewport: { width: 300, height: 100 } });

test('base view', async({ render }) => {
  const component = await render(<TxFee tx={ txMock.base }/>);
  await expect(component).toHaveScreenshot();
});

test('no usd value', async({ render }) => {
  const component = await render(<TxFee tx={ txMock.base } accuracy={ 3 } noUsd/>);
  await expect(component).toHaveScreenshot();
});

test('celo gas token', async({ render, mockAssetResponse }) => {
  await mockAssetResponse(txMockCelo.celoTxn.celo?.gas_token?.icon_url as string, './playwright/mocks/image_svg.svg');
  const component = await render(<TxFee tx={ txMockCelo.celoTxn }/>);
  await expect(component).toHaveScreenshot();
});

test('stability token', async({ render, mockAssetResponse }) => {
  await mockAssetResponse(txMockStability.stabilityTx.stability_fee?.token.icon_url as string, './playwright/mocks/image_svg.svg');
  const component = await render(<TxFee tx={ txMockStability.stabilityTx }/>);
  await expect(component).toHaveScreenshot();
});
