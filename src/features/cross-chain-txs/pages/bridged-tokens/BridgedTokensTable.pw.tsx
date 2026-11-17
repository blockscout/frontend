import * as bridgedTokensMock from 'src/features/cross-chain-txs/mocks/bridged-tokens';
import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import BridgedTokensTable from './BridgedTokensTable';

const noop = () => {};

test('base view', async({ render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    ...ENVS_MAP.crossChainTxs,
    [ 'NEXT_PUBLIC_NETWORK_ID', chainA.id ],
  ]);
  await mockAssetResponse(bridgedTokensMock.bridgedTokenErc20.icon_url, './playwright/mocks/image_s.jpg');

  const component = await render(
    <BridgedTokensTable
      data={ bridgedTokensMock.listResponse.items }
      chainsData={ [ chainA, chainB ] }
      sort="default"
      setSorting={ noop }
      page={ 1 }
    />,
  );

  await expect(component).toHaveScreenshot();
});
