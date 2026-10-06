// SPDX-License-Identifier: LicenseRef-Blockscout

import type { CaptureOptions, PostHog, PostHogConfig } from 'posthog-js';

import config from 'src/config';
import { EventTypes } from 'src/shared/analytics/events';
import type { AnalyticsProvider, TrackOptions } from 'src/shared/analytics/provider';

let sdk: PostHog | undefined;

function getCaptureOptions({ timestamp, sendImmediately }: TrackOptions): CaptureOptions | undefined {
  if (timestamp === undefined && !sendImmediately) {
    return;
  }

  return {
    ...(timestamp === undefined ? {} : { timestamp: new Date(timestamp) }),
    ...(sendImmediately ? { send_instantly: true } : {}),
  };
}

export const posthogProvider: AnalyticsProvider = {
  init: async({ debug }) => {
    const { apiKey, configOverrides } = config.services.posthog;
    if (!apiKey) {
      throw new Error('PostHog API key is not configured');
    }

    const posthog = (await import('posthog-js')).default;
    const posthogConfig: Partial<PostHogConfig> = {
      api_host: 'https://eu.i.posthog.com',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      // also skips the remote config fetch, so remotely enabled surveys, heatmaps, etc. stay off
      advanced_disable_flags: true,
      persistence: 'localStorage',
      debug,
      ...configOverrides,
    };
    posthog.init(apiKey, posthogConfig);
    sdk = posthog;
  },
  track: (event, properties, options) => {
    const eventName = event === EventTypes.PAGE_VIEW ? '$pageview' : event;
    sdk?.capture(eventName, properties, getCaptureOptions(options));
  },
  register: (superProps) => {
    sdk?.register(superProps);
  },
  identify: (distinctId) => {
    if (distinctId) {
      sdk?.identify(distinctId);
    }
  },
  peopleSet: (props) => {
    sdk?.setPersonProperties(props);
  },
  peopleSetOnce: (props) => {
    sdk?.setPersonProperties(undefined, props);
  },
  reset: () => {
    sdk?.reset();
  },
};
