import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { SECOND } from 'lib/consts';
import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';

import GasInfoTooltip from './GasInfoTooltip';
import GasPrice from './GasPrice';

const dataUpdatedAt = Date.now() - 30 * SECOND;

test.use({ viewport: { width: 300, height: 300 } });

test('all data', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasInfoTooltip data={ statsMock.base } dataUpdatedAt={ dataUpdatedAt } isOpen>
        <span>Gas <GasPrice data={ statsMock.base.gas_prices.average }/></span>
      </GasInfoTooltip>
    </TestApp>,
  );

  // await page.getByText(/gas/i).hover();
  await page.getByText(/last update/i).isVisible();
  await expect(page).toHaveScreenshot();
});

test('without primary unit price', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasInfoTooltip data={ statsMock.withoutFiatPrices } dataUpdatedAt={ dataUpdatedAt } isOpen>
        <span>Gas: <GasPrice data={ statsMock.withoutFiatPrices.gas_prices.average }/></span>
      </GasInfoTooltip>
    </TestApp>,
  );

  // await page.getByText(/gas/i).hover();
  await page.getByText(/last update/i).isVisible();
  await expect(page).toHaveScreenshot();
});

test('without secondary unit price', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasInfoTooltip data={ statsMock.withoutGweiPrices } dataUpdatedAt={ dataUpdatedAt } isOpen>
        <span>Gas: <GasPrice data={ statsMock.withoutGweiPrices.gas_prices.average }/></span>
      </GasInfoTooltip>
    </TestApp>,
  );

  // await page.getByText(/gas/i).hover();
  await page.getByText(/last update/i).isVisible();
  await expect(page).toHaveScreenshot();
});

test('no data', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasInfoTooltip data={ statsMock.withoutBothPrices } dataUpdatedAt={ dataUpdatedAt } isOpen>
        <span>Gas: <GasPrice data={ statsMock.withoutBothPrices.gas_prices.average }/></span>
      </GasInfoTooltip>
    </TestApp>,
  );

  // await page.getByText(/gas/i).hover();
  await page.getByText(/last update/i).isVisible();
  await expect(page).toHaveScreenshot();
});

const oneUnitTest = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_GAS_TRACKER_UNITS', value: '["gwei"]' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

oneUnitTest.describe('one unit', () => {
  oneUnitTest('with data', async({ mount, page }) => {
    await mount(
      <TestApp>
        <GasInfoTooltip data={ statsMock.withoutFiatPrices } dataUpdatedAt={ dataUpdatedAt } isOpen>
          <span>Gas: <GasPrice data={ statsMock.withoutFiatPrices.gas_prices.average }/></span>
        </GasInfoTooltip>
      </TestApp>,
    );

    // await page.getByText(/gas/i).hover();
    await page.getByText(/last update/i).isVisible();
    await expect(page).toHaveScreenshot();
  });

  oneUnitTest('without data', async({ mount, page }) => {
    await mount(
      <TestApp>
        <GasInfoTooltip data={ statsMock.withoutGweiPrices } dataUpdatedAt={ dataUpdatedAt } isOpen>
          <span>Gas: <GasPrice data={ statsMock.withoutGweiPrices.gas_prices.average }/></span>
        </GasInfoTooltip>
      </TestApp>,
    );

    // await page.getByText(/gas/i).hover();
    await page.getByText(/last update/i).isVisible();
    await expect(page).toHaveScreenshot();
  });
});
