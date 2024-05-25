import { devices } from '@playwright/test';

export const viewport = {
  mobile: devices['iPhone 13 Pro'].viewport,
  md: { width: 1001, height: 800 },
  xl: { width: 1600, height: 1000 },
};

export const maskColor = '#4299E1'; // blue.400

export const adsBannerSelector = '.adsbyslise';
