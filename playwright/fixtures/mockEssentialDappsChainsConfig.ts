import type { TestFixture, Page } from '@playwright/test';

import * as essentialDappsChainsMock from 'mocks/essentialDapps/chains';

export type MockEssentialDappsChainsConfigFixture = () => Promise<void>;

const fixture: TestFixture<MockEssentialDappsChainsConfigFixture, { page: Page }> = async({ page }, use) => {
  await use(async() => {
    await page.evaluate(([ essentialDappsChainsMock ]) => {
      window.__essentialDappsChains = {
        chains: [
          essentialDappsChainsMock.chainDataA,
        ],
      };
    }, [ essentialDappsChainsMock ]);
  });
};

export default fixture;
