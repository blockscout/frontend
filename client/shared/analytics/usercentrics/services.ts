import type { UsercentricsConsentResult } from './types';

export const SERVICES = {
  mixpanel: {
    name: 'Mixpanel',
  },
  googleAnalytics: {
    name: 'Google Tag Manager',
  },
  rollbar: {
    name: 'Rollbar',
  },
  growthBook: {
    name: 'GrowthBook',
  },
  adbutler: {
    name: 'AdButler',
  },
  slise: {
    name: 'Slise',
  },
  sevio: {
    name: 'Sevio',
  },
  specify: {
    name: 'Specify',
  },
};

export const SERVICES_NAMES = Object.values(SERVICES).map(({ name }) => name);

export const CONSENT_RESULT_ALL_ACCEPTED: UsercentricsConsentResult = {
  mixpanel: true,
  googleAnalytics: true,
  rollbar: true,
  growthBook: true,
  adbutler: true,
  slise: true,
  sevio: true,
  specify: true,
};
