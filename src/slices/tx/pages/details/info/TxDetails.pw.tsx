import React from 'react';

import * as tokenInstanceMock from 'src/slices/token/mocks/instance';
import * as txMock from 'src/slices/tx/mocks/details';

import { stabilityTx } from 'src/features/chain-variants/stability/mocks/tx';
import { withBlob } from 'src/features/data-availability/mocks/tx';
import { withInteropInMessage, withInteropOutMessage } from 'src/features/op-interop/mocks/tx';
import { arbitrumTxn } from 'src/features/rollup/arbitrum/mocks/tx';
import { l2tx } from 'src/features/rollup/common/mocks/tx';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import TxDetails from './TxDetails';

test('between addresses +@mobile +@dark-mode', async({ render, page }) => {
  const component = await render(<TxDetails data={ txMock.base } isLoading={ false }/>);

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('creating contact', async({ render, page }) => {
  const component = await render(<TxDetails data={ txMock.withContractCreation } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with token transfer +@mobile', async({ render, page, mockAssetResponse }) => {
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(<TxDetails data={ txMock.withTokenTransfer } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('pending', async({ render, page }) => {
  const component = await render(<TxDetails data={ txMock.pending } isLoading={ false }/>);

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with blob', async({ render, page }) => {
  const component = await render(<TxDetails data={ withBlob } isLoading={ false }/>);

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('l2', async({ render, page, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.optimisticRollup);
  const component = await render(<TxDetails data={ l2tx } isLoading={ false }/>);
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('without testnet warning', async({ render, page, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_IS_TESTNET', 'false' ],
  ]);
  const component = await render(<TxDetails data={ l2tx } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('stability customization', async({ render, page, mockEnvs, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.stabilityEnvs);
  await mockAssetResponse(stabilityTx.stability_fee?.token.icon_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(<TxDetails data={ stabilityTx } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with grouped fees', async({ render, page, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES', 'true' ],
    [ 'NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS', '["gas_price","gas_fees","burnt_fees"]' ],
    [ 'NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS', '["set_max_gas_limit"]' ],
  ]);
  const component = await render(<TxDetails data={ txMock.base } isLoading={ false }/>);

  await component.getByText('View details').first().click();
  await component.getByText('View details').first().click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('arbitrum L1 status', async({ render, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  const component = await render(<TxDetails data={ arbitrumTxn } isLoading={ false }/>);

  const statusElement = component.locator('div').filter({ hasText: 'Processed on rollup' }).nth(2);

  await expect(statusElement).toHaveScreenshot();
});

test('with external txs +@mobile', async({ page, render, mockEnvs, mockApiResponse, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.externalTxs);
  await mockApiResponse('core:tx_external_transactions', [ 'tx1', 'tx2', 'tx3' ], { pathParams: { hash: txMock.base.hash } });
  await mockAssetResponse('http://example.url', './playwright/mocks/image_s.jpg');
  const component = await render(<TxDetails data={ txMock.base } isLoading={ false }/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with interop message in +@mobile', async({ render, page, mockEnvs, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.interop);
  await mockAssetResponse('https://example.com/logo.png', './playwright/mocks/image_s.jpg');
  const component = await render(<TxDetails data={ withInteropInMessage } isLoading={ false }/>);
  await page.getByText('View details').first().click();
  await expect(page.getByText('Interop status')).toBeVisible();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with interop message out +@mobile', async({ page, render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.interop);
  await mockAssetResponse('https://example.com/logo.png', './playwright/mocks/image_s.jpg');
  const component = await render(<TxDetails data={ withInteropOutMessage } isLoading={ false }/>);
  await component.getByText('View details').first().click();
  await expect(component.getByText('Interop status')).toBeVisible();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
    maxDiffPixels: 20,
  });
});
