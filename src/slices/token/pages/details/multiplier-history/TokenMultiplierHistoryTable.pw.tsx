import { tokenUiMultiplierChanges } from 'src/slices/token/mocks/ui-multiplier';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import TokenMultiplierHistoryTable from './TokenMultiplierHistoryTable';

test('base view', async({ render, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);

  const component = await render(
    <TokenMultiplierHistoryTable data={ tokenUiMultiplierChanges.items } page={ 1 }/>,
  );

  await expect(component).toHaveScreenshot();
});
