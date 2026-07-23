// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Mixpanel } from 'mixpanel-browser';

import { track } from './queue';
import type { EventTypes, EventPayload } from './utils';

type TrackFnArgs = Parameters<Mixpanel['track']>;

export default function logEvent<EventType extends EventTypes>(
  type: EventType,
  properties?: EventPayload<EventType>,
  optionsOrCallback?: TrackFnArgs[2],
  callback?: TrackFnArgs[3],
) {
  track(type, properties, optionsOrCallback, callback);
}
