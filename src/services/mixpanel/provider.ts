// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Config, Mixpanel } from 'mixpanel-browser';

import config from 'src/config';
import type { AnalyticsProvider } from 'src/shared/analytics/provider';

import { SECOND } from 'src/toolkit/utils/consts';

let sdk: Mixpanel | undefined;

export const mixpanelProvider: AnalyticsProvider = {
  init: async({ debug }) => {
    const { projectToken, configOverrides } = config.services.mixpanel;
    if (!projectToken) {
      throw new Error('Mixpanel project token is not configured');
    }

    const mixpanel = (await import('mixpanel-browser')).default;
    const mixpanelConfig: Partial<Config> = {
      debug,
      persistence: 'localStorage',
      api_host: 'https://api-eu.mixpanel.com',
      ...configOverrides,
    };
    mixpanel.init(projectToken, mixpanelConfig);
    sdk = mixpanel;
  },
  track: (event, properties, { timestamp, sendImmediately }) => {
    // `time` (epoch seconds) backdates a replayed event to when it was actually fired;
    // a caller-provided `time` property still wins
    const props = timestamp === undefined ? properties : { time: timestamp / SECOND, ...properties };
    sdk?.track(event, props, sendImmediately ? { send_immediately: true } : undefined);
  },
  register: (superProps) => {
    sdk?.register(superProps);
  },
  identify: (distinctId) => {
    sdk?.identify(distinctId);
  },
  peopleSet: (props) => {
    sdk?.people.set(props);
  },
  peopleSetOnce: (props) => {
    sdk?.people.set_once(props);
  },
  reset: () => {
    sdk?.reset();
  },
};
