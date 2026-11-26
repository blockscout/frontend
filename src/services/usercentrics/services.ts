// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UsercentricsConsentResult } from './types';

export const SERVICES = {
  mixpanel: {
    name: 'Mixpanel',
  },
  posthog: {
    name: 'PostHog',
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
  posthog: true,
  googleAnalytics: true,
  rollbar: true,
  growthBook: true,
  adbutler: true,
  slise: true,
  sevio: true,
  specify: true,
};

export const CONSENT_RESULT_ALL_DENIED: UsercentricsConsentResult = {
  mixpanel: false,
  posthog: false,
  googleAnalytics: false,
  rollbar: false,
  growthBook: false,
  adbutler: false,
  slise: false,
  sevio: false,
  specify: false,
};
