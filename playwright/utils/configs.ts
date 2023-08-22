import { devices } from '@playwright/test';

export const viewport = {
  mobile: devices['iPhone 13 Pro'].viewport,
  xl: { width: 1600, height: 1000 },
};

export const maskColor = '#4299E1'; // blue.400

export const adsBannerSelector = '.adsbyslise';

export const featureEnvs = {
  beaconChain: [
    { name: 'NEXT_PUBLIC_HAS_BEACON_CHAIN', value: 'true' },
  ],
  rollup: [
    { name: 'NEXT_PUBLIC_IS_L2_NETWORK', value: 'true' },
    { name: 'NEXT_PUBLIC_L1_BASE_URL', value: 'https://localhost:3101' },
    { name: 'NEXT_PUBLIC_L2_WITHDRAWAL_URL', value: 'https://localhost:3102' },
  ],
};

export const viewsEnvs = {
  block: {
    hiddenFields: [
      { name: 'NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS', value: '["burnt_fees", "total_reward"]' },
    ],
  },
};
