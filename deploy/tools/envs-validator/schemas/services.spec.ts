// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../test-utils';
import { getValidationErrors } from '../utils';
import servicesSchema from './services';

const mixpanelOverrides = { record_sessions_percent: 0.5, record_heatmap_data: true };
const posthogOverrides = { disable_session_recording: false };

describe('servicesSchema', () => {
  it('accepts the external service keys', () => {
    expect(getValidationErrors(servicesSchema, {
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'xxx',
      NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS: toEnvValue([ 'xxx' ]),
      NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY: 'xxx',
      NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: 'UA-XXXXXX-X',
      NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY: 'xxx',
      NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: 'https://rollbar.com',
      NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: 'xxx',
      NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: toEnvValue(mixpanelOverrides),
      NEXT_PUBLIC_POSTHOG_API_KEY: 'xxx',
      NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES: toEnvValue(posthogOverrides),
    })).toEqual([]);
  });

  it('rejects featured wallet ids that are not a JSON array', () => {
    expect(getValidationErrors(servicesSchema, { NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS: 'xxx' })).toEqual([
      'NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS: Invalid JSON: Received "xxx"',
    ]);
  });

  describe('Mixpanel config overrides', () => {
    it('rejects the overrides without the project token', () => {
      expect(getValidationErrors(servicesSchema, { NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: toEnvValue(mixpanelOverrides) })).toEqual([
        'NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES can only be used if NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN is set to a non-empty string',
      ]);
    });

    it('rejects overrides that are not a JSON object', () => {
      expect(getValidationErrors(servicesSchema, {
        NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: 'xxx',
        NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: 'not json',
      })).toEqual([
        'NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: Invalid JSON: Received "not json"',
      ]);
    });
  });

  describe('PostHog config overrides', () => {
    it('rejects the overrides without the API key', () => {
      expect(getValidationErrors(servicesSchema, { NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES: toEnvValue(posthogOverrides) })).toEqual([
        'NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES can only be used if NEXT_PUBLIC_POSTHOG_API_KEY is set to a non-empty string',
      ]);
    });

    it('rejects overrides that are not a JSON object', () => {
      expect(getValidationErrors(servicesSchema, {
        NEXT_PUBLIC_POSTHOG_API_KEY: 'xxx',
        NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES: 'not json',
      })).toEqual([
        'NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES: Invalid JSON: Received "not json"',
      ]);
    });
  });
});
