import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';
import * as txMock from 'src/slices/tx/mocks/details';
import * as txStateChangesMock from 'src/slices/tx/mocks/state-changes';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { expect, test } from 'playwright/lib';

import TxState from './TxState';

const hooksConfig = {
  router: {
    query: { hash: txMock.base.hash },
  },
};

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockApiResponse('core:tx_state_changes', txStateChangesMock.baseResponse, { pathParams: { hash: txMock.base.hash } });
  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;
  const component = await render(<TxState txQuery={ txQuery }/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
