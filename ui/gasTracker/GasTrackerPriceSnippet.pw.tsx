import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import GasTrackerPriceSnippet from './GasTrackerPriceSnippet';

test.use({ viewport: configs.viewport.md });

const data = statsMock.base.gas_prices.fast;
const clip = { x: 0, y: 0, width: 334, height: 204 };

test('with usd as primary unit +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasTrackerPriceSnippet
        data={ data }
        type="fast"
        isLoading={ false }
      />
    </TestApp>,
  );
  await expect(page).toHaveScreenshot({ clip });
});

test('loading state', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasTrackerPriceSnippet
        data={ data }
        type="fast"
        isLoading={ true }
      />
    </TestApp>,
  );
  await expect(page).toHaveScreenshot({ clip });
});

const gweiUnitsTest = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_GAS_TRACKER_UNITS', value: '["gwei","usd"]' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

gweiUnitsTest('with gwei as primary unit +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <GasTrackerPriceSnippet
        data={ data }
        type="slow"
        isLoading={ false }
      />
    </TestApp>,
  );
  await expect(page).toHaveScreenshot({ clip });
});
