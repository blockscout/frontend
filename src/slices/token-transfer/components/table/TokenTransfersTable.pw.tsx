import * as tokenTransferMock from 'src/slices/token-transfer/mocks';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { expect, test } from 'playwright/lib';

import { TOKEN_TRANSFER_COLUMNS } from '../../utils/columns';
import TokenTransfersTable from './TokenTransfersTable';

test('base view', async({ render, mockAssetResponse, mockEnvs, page }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <TokenTransfersTable
      items={ tokenTransferMock.mixTokens.items }
      columns={ TOKEN_TRANSFER_COLUMNS.map(({ id }) => id).filter((id) => id !== 'in_out') }
    />,
  );

  await expect(component).toHaveScreenshot();
  await page.mouse.wheel(1000, 0);
  await expect(component).toHaveScreenshot();
});
