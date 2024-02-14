import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TxInfo from './TxInfo';

const hooksConfig = {
  router: {
    query: { hash: 1 },
  },
};

test('between addresses +@mobile +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.base } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('creating contact', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.withContractCreation } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('with token transfer +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.withTokenTransfer } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('with decoded revert reason', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.withDecodedRevertReason } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('with decoded raw reason', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.withRawRevertReason } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('pending', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.pending } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('with actions uniswap +@mobile +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.withActionsUniswap } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

const l2Test = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.optimisticRollup) as any,
});

l2Test('l2', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.l2tx } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

const mainnetTest = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_IS_TESTNET', value: 'false' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

mainnetTest('without testnet warning', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.l2tx } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

const stabilityTest = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.stabilityEnvs) as any,
});

stabilityTest('stability customization', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxInfo data={ txMock.stabilityTx } isLoading={ false }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
