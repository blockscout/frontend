import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txInterpretation } from 'mocks/txs/txInterpretation';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import TxSubHeading from './TxSubHeading';

const hash = '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193';

const TX_INTERPRETATION_API_URL = buildApiUrl('tx_interpretation', { hash });

test('no interpretation +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxSubHeading hash={ hash } hasTag={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

const bsInterpretationTest = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.txInterpretation) as any,
});

bsInterpretationTest('with interpretation +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(TX_INTERPRETATION_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txInterpretation),
  }));

  const component = await mount(
    <TestApp>
      <TxSubHeading hash={ hash } hasTag={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

bsInterpretationTest('no interpretation', async({ mount, page }) => {
  await page.route(TX_INTERPRETATION_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ data: { summaries: [] } }),
  }));

  const component = await mount(
    <TestApp>
      <TxSubHeading hash={ hash } hasTag={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
