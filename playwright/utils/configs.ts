/* eslint-disable max-len */
import { devices } from '@playwright/test';

export const viewport = {
  mobile: devices['iPhone 13 Pro'].viewport,
  md: { width: 1001, height: 800 },
  xl: { width: 1600, height: 1000 },
};

export const maskColor = '#4299E1'; // blue.400

export const adsBannerSelector = '.adsbyslise';

export const featureEnvs = {
  beaconChain: [
    { name: 'NEXT_PUBLIC_HAS_BEACON_CHAIN', value: 'true' },
  ],
  optimisticRollup: [
    { name: 'NEXT_PUBLIC_ROLLUP_TYPE', value: 'optimistic' },
    { name: 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', value: 'https://localhost:3101' },
    { name: 'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL', value: 'https://localhost:3102' },
  ],
  txInterpretation: [
    { name: 'NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER', value: 'blockscout' },
  ],
  zkEvmRollup: [
    { name: 'NEXT_PUBLIC_ROLLUP_TYPE', value: 'zkEvm' },
    { name: 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', value: 'https://localhost:3101' },
  ],
  zkSyncRollup: [
    { name: 'NEXT_PUBLIC_ROLLUP_TYPE', value: 'zkSync' },
    { name: 'NEXT_PUBLIC_ROLLUP_L1_BASE_URL', value: 'https://localhost:3101' },
  ],
  userOps: [
    { name: 'NEXT_PUBLIC_HAS_USER_OPS', value: 'true' },
  ],
  validators: [
    { name: 'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', value: 'stability' },
  ],
};

export const viewsEnvs = {
  block: {
    hiddenFields: [
      { name: 'NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS', value: '["burnt_fees", "total_reward", "nonce"]' },
    ],
  },
};

export const stabilityEnvs = [
  { name: 'NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS', value: '["top_accounts"]' },
  { name: 'NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS', value: '["value","fee_currency","gas_price","gas_fees","burnt_fees"]' },
  { name: 'NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS', value: '["fee_per_gas"]' },
];
