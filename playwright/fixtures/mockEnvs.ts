/* eslint-disable max-len */
import type { TestFixture, Page } from '@playwright/test';

export type MockEnvsFixture = (envs: Array<[string, string]>) => Promise<void>;

const fixture: TestFixture<MockEnvsFixture, { page: Page }> = async({ page }, use) => {
  await use(async(envs) => {
    for (const [ name, value ] of envs) {
      await page.evaluate(({ name, value }) => {
        window.localStorage.setItem(name, value);
      }, { name, value });
    }
  });
};

export default fixture;

export const ENVS_MAP: Record<string, Array<[string, string]>> = {
  shibariumRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'shibarium' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
  ],
  zkEvmRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'zkEvm' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
  ],
  bridgedTokens: [
    [ 'NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS', '[{"id":"1","title":"Ethereum","short_title":"ETH","base_url":"https://eth.blockscout.com/token/"},{"id":"56","title":"Binance Smart Chain","short_title":"BSC","base_url":"https://bscscan.com/token/"},{"id":"99","title":"POA","short_title":"POA","base_url":"https://blockscout.com/poa/core/token/"}]' ],
    [ 'NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES', '[{"type":"omni","title":"OmniBridge","short_title":"OMNI"},{"type":"amb","title":"Arbitrary Message Bridge","short_title":"AMB"}]' ],
  ],
  userOps: [
    [ 'NEXT_PUBLIC_HAS_USER_OPS', 'true' ],
  ],
  hasContractAuditReports: [
    [ 'NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS', 'true' ],
  ],
  blockHiddenFields: [
    [ 'NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS', '["burnt_fees", "total_reward", "nonce"]' ],
  ],
};
