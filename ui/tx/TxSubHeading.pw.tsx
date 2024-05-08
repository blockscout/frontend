import React from 'react';

import * as txMock from 'mocks/txs/tx';
import { txInterpretation } from 'mocks/txs/txInterpretation';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TxSubHeading from './TxSubHeading';
import type { TxQuery } from './useTxQuery';

const hash = '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193';

const txQuery = {
  data: txMock.base,
  isPlaceholderData: false,
  isError: false,
} as TxQuery;

test('no interpretation +@mobile', async({ render }) => {
  const component = await render(<TxSubHeading hash={ hash } hasTag={ false } txQuery={ txQuery }/>);
  await expect(component).toHaveScreenshot();
});

test.describe('blockscout provider', () => {
  test.beforeEach(async({ mockEnvs }) => {
    await mockEnvs(ENVS_MAP.txInterpretation);
  });

  test('with interpretation +@mobile +@dark-mode', async({ render, mockApiResponse }) => {
    await mockApiResponse('tx_interpretation', txInterpretation, { pathParams: { hash } });
    const component = await render(<TxSubHeading hash={ hash } hasTag={ false } txQuery={ txQuery }/>);
    await expect(component).toHaveScreenshot();
  });

  test('with interpretation and view all link +@mobile', async({ render, mockApiResponse }) => {
    await mockApiResponse(
      'tx_interpretation',
      { data: { summaries: [ ...txInterpretation.data.summaries, ...txInterpretation.data.summaries ] } },
      { pathParams: { hash } },
    );
    const component = await render(<TxSubHeading hash={ hash } hasTag={ false } txQuery={ txQuery }/>);
    await expect(component).toHaveScreenshot();
  });

  test('no interpretation, has method called', async({ render, mockApiResponse }) => {
    await mockApiResponse('tx_interpretation', { data: { summaries: [] } }, { pathParams: { hash } });
    const component = await render(<TxSubHeading hash={ hash } hasTag={ false } txQuery={ txQuery }/>);
    await expect(component).toHaveScreenshot();
  });

  test('no interpretation', async({ render, mockApiResponse }) => {
    const txPendingQuery = {
      data: txMock.pending,
      isPlaceholderData: false,
      isError: false,
    } as TxQuery;
    await mockApiResponse('tx_interpretation', { data: { summaries: [] } }, { pathParams: { hash } });
    const component = await render(<TxSubHeading hash={ hash } hasTag={ false } txQuery={ txPendingQuery }/>);
    await expect(component).toHaveScreenshot();
  });
});
