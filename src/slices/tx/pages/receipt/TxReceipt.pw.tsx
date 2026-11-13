import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import * as statsMock from 'src/slices/chain/stats/mocks';
import { tokenInfo } from 'src/slices/token/mocks/info';
import * as txMock from 'src/slices/tx/mocks/details';

import * as interpretationMock from 'src/features/tx-interpretation/blockscout/mocks';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';

import TxReceipt from './TxReceipt';

const HASH = txMock.base.hash;

const hooksConfig = {
  router: {
    query: { hash: HASH },
  },
};

interface ReceiptMocks {
  readonly tx: schemas['TransactionResponse'];
  readonly interpretation: TxInterpretationResponse | null;
}

const mockReceipt = async(
  { mockEnvs, mockApiResponse, mockAssetResponse }: Pick<TestFnArgs, 'mockEnvs' | 'mockApiResponse' | 'mockAssetResponse'>,
  { tx, interpretation }: ReceiptMocks,
) => {
  await mockEnvs(ENVS_MAP.txInterpretation);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:tx', tx, { pathParams: { hash: HASH } });
  if (interpretation) {
    await mockApiResponse('core:tx_interpretation', interpretation, { pathParams: { hash: HASH } });
  }
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(interpretationMock.MARKET_ICON_URL, './playwright/mocks/image_svg.svg');
};

test('transfer view with a token, success', async({ render, mockEnvs, mockApiResponse, mockAssetResponse }) => {
  await mockReceipt({ mockEnvs, mockApiResponse, mockAssetResponse }, { tx: txMock.base, interpretation: interpretationMock.txInterpretation });
  const component = await render(<TxReceipt/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('call fallback, pending with a spinner and dashes', async({ render, mockEnvs, mockApiResponse, mockAssetResponse }) => {
  await mockReceipt({ mockEnvs, mockApiResponse, mockAssetResponse }, { tx: txMock.pendingContractCall, interpretation: null });
  const component = await render(<TxReceipt/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('interpretation sentence with an action type, a market and a named address, failed +@mobile +@dark-mode', async({
  render,
  mockEnvs,
  mockApiResponse,
  mockAssetResponse,
}) => {
  await mockReceipt(
    { mockEnvs, mockApiResponse, mockAssetResponse },
    { tx: txMock.failedCallToLongNamedContract, interpretation: interpretationMock.swapOnMarket },
  );
  const component = await render(<TxReceipt/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
