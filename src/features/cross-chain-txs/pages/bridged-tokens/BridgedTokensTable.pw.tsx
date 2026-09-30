import * as bridgedTokensMock from 'src/features/cross-chain-txs/mocks/bridged-tokens';
import { chainB, homeChain } from 'src/features/cross-chain-txs/mocks/chains';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import BridgedTokensTable from './BridgedTokensTable';

const noop = () => {};

test('base view', async({ render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs(ENVS_MAP.crossChainTxs);
  await mockAssetResponse(bridgedTokensMock.bridgedTokenErc20.icon_url, './playwright/mocks/image_s.jpg');

  const component = await render(
    <BridgedTokensTable
      data={ bridgedTokensMock.listResponse.items }
      chainsData={ [ homeChain, chainB ] }
      sort="default"
      setSorting={ noop }
      page={ 1 }
    />,
  );

  await expect(component).toHaveScreenshot();
});
