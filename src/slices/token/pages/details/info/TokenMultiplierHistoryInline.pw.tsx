import { tokenInfoERC8056 } from 'src/slices/token/mocks/info';
import { tokenUiMultiplierChangesOverflow } from 'src/slices/token/mocks/ui-multiplier';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import TokenMultiplierHistoryInline from './TokenMultiplierHistoryInline';

const hash = tokenInfoERC8056.address_hash;

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockApiResponse(
    'core:token_ui_multiplier_changes',
    tokenUiMultiplierChangesOverflow,
    { pathParams: { hash } },
  );

  const component = await render(
    <TokenMultiplierHistoryInline hash={ hash } changesCount={ 7 }/>,
  );

  await component.getByText('View history').click();
  await expect(component.getByRole('link', { name: 'View all' })).toBeVisible();

  await expect(component).toHaveScreenshot();
});
