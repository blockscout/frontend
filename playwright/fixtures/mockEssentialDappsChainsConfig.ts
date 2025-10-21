import type { TestFixture, Page } from '@playwright/test';

import * as opSuperchainMock from 'mocks/multichain/opSuperchain';

export type MockEssentialDappsChainsConfigFixture = () => Promise<void>;

const fixture: TestFixture<MockEssentialDappsChainsConfigFixture, { page: Page }> = async({ page }, use) => {
  await use(async() => {
    await page.evaluate(([ opSuperchainMock ]) => {
      window.__essentialDappsChains = {
        chains: [
          opSuperchainMock.chainDataA,
        ],
      };
    }, [ opSuperchainMock ]);
  });
};

export default fixture;
