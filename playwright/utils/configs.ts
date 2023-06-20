import { devices } from '@playwright/test';

export const viewport = {
  mobile: devices['iPhone 13 Pro'].viewport,
  xl: { width: 1600, height: 1000 },
};
