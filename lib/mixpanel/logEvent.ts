import mixpanel from 'mixpanel-browser';

import type { EventTypes, EventPayload } from './utils';

type TrackFnArgs = Parameters<typeof mixpanel.track>;

export default function logEvent<EventType extends EventTypes>(
  type: EventType,
  properties?: EventPayload<EventType>,
  optionsOrCallback?: TrackFnArgs[2],
  callback?: TrackFnArgs[3],
) {
  mixpanel.track(type, properties, optionsOrCallback, callback);
}
