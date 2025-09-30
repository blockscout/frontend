import type { TestFixture, Page } from '@playwright/test';

import * as opSuperchainMock from 'mocks/multichain/opSuperchain';

export type MockMultichainConfigFixture = () => Promise<void>;

const fixture: TestFixture<MockMultichainConfigFixture, { page: Page }> = async({ page }, use) => {
  await use(async() => {
    await page.evaluate(([ opSuperchainMock ]) => {
      window.__multichainConfig = {
        chains: [
          opSuperchainMock.chainDataA,
        ],
      };
    }, [ opSuperchainMock ]);
  });
};

export default fixture;
