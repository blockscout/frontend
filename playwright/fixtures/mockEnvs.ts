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
  optimisticRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'optimistic' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
    [ 'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL', 'https://localhost:3102' ],
    [ 'NEXT_PUBLIC_FAULT_PROOF_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL', 'https://mocha.celenium.io/blob' ],
  ],
  arbitrumRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'arbitrum' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
    [ 'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN_NAME', 'DuckChain' ],
    [ 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE', '0x1234' ],
    [ 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL', 'https://mocha.celenium.io/blob' ],
  ],
  shibariumRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'shibarium' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
  ],
  zkEvmRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'zkEvm' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
  ],
  zkSyncRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'zkSync' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
    [ 'NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS', 'none' ],
  ],
  scrollRollup: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'scroll' ],
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
  stabilityEnvs: [
    [ 'NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS', '["top_accounts"]' ],
    [ 'NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS', '["value","fee_currency","gas_price","gas_fees","burnt_fees"]' ],
    [ 'NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS', '["fee_per_gas"]' ],
  ],
  beaconChain: [
    [ 'NEXT_PUBLIC_HAS_BEACON_CHAIN', 'true' ],
  ],
  txInterpretation: [
    [ 'NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER', 'blockscout' ],
  ],
  noWalletClient: [
    [ 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '' ],
  ],
  noAccount: [
    [ 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', 'false' ],
  ],
  noNftMarketplaces: [
    [ 'NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES', '' ],
  ],
  navigationHighlightedRoutes: [
    [ 'NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES', '["/blocks", "/apps"]' ],
  ],
  dataAvailability: [
    [ 'NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED', 'true' ],
  ],
  nameService: [
    [ 'NEXT_PUBLIC_NAME_SERVICE_API_HOST', 'https://localhost:3008' ],
  ],
  rewardsService: [
    [ 'NEXT_PUBLIC_REWARDS_SERVICE_API_HOST', 'http://localhost:3009' ],
  ],
  addressBech32Format: [
    [ 'NEXT_PUBLIC_ADDRESS_FORMAT', '["bech32","base16"]' ],
    [ 'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX', 'tom' ],
  ],
  externalTxs: [
    [ 'NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG', '{"chain_name": "Solana", "chain_logo_url": "http://example.url", "explorer_url_template": "https://scan.io/tx/{hash}"}' ],
  ],
  interop: [
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'optimistic' ],
    [ 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101' ],
    [ 'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL', 'https://localhost:3102' ],
    [ 'NEXT_PUBLIC_INTEROP_ENABLED', 'true' ],
  ],
  tac: [
    [ 'NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST', 'http://localhost:3100' ],
    [ 'NEXT_PUBLIC_TAC_TON_EXPLORER_URL', 'https://testnet.tonviewer.com' ],
  ],
};
