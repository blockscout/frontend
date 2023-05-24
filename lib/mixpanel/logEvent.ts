import mixpanel from 'mixpanel-browser';

import appConfig from 'configs/app/config';

import type { EventTypes, EventPayload } from './utils';

type TrackFnArgs = Parameters<typeof mixpanel.track>;

export default function logEvent<EventType extends EventTypes>(
  type: EventType,
  properties?: EventPayload<EventType>,
  optionsOrCallback?: TrackFnArgs[2],
  callback?: TrackFnArgs[3],
) {
  if (!appConfig.mixpanel.projectToken) {
    return;
  }
  mixpanel.track(type, properties, optionsOrCallback, callback);
}
